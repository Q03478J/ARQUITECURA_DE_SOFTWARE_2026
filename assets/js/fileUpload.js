// ===================================
// FILE UPLOAD SYSTEM - ERY CURSOS
// SUPABASE STORAGE & DATABASE SYNC
// ===================================

class FileUploadManager {
    constructor(supabaseUrl = null, supabaseKey = null) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.supabaseClient = null;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg', 'image/png', 'application/zip'
        ];
        this.uploadedFiles = [];
        this.init();
    }

    async init() {
        this.initSupabase();

        // Cargar archivos: Prioridad Supabase, Fallback LocalStorage
        if (this.supabaseClient) {
            await this.loadFilesFromSupabase();
        } else {
            this.uploadedFiles = this.loadFromStorage();
        }

        this.setupEventListeners();
        this.renderUploadedFiles();
    }

    initSupabase() {
        if (this.supabaseUrl && this.supabaseKey && window.supabase) {
            this.supabaseClient = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
            return true;
        }
        return false;
    }

    // --- CARGA DE ARCHIVOS ---
    async loadFilesFromSupabase() {
        try {
            const { data, error } = await this.supabaseClient
                .from('files')
                .select('*')
                .order('upload_date', { ascending: false });

            if (error) throw error;
            this.uploadedFiles = data || [];
            this.saveToStorage(); // Sync local cache
        } catch (error) {
            console.error('Error cargando archivos:', error);
            this.uploadedFiles = this.loadFromStorage();
        }
    }

    // --- MANEJO DE SUBIDAS ---
    async handleFiles(files, unit, lesson) {
        for (let file of files) {
            if (!this.validateFile(file)) continue;

            const fileId = `file_${Date.now()}`;
            this.setLoading(unit, lesson, true);

            try {
                let fileUrl = null;
                const fileName = `${unit}/${lesson}/${Date.now()}_${file.name}`;

                if (this.supabaseClient) {
                    // 1. Subir al Bucket 'course-uploads'
                    const { data: storageData, error: storageError } = await this.supabaseClient
                        .storage.from('course-uploads').upload(fileName, file);
                    
                    if (storageError) throw storageError;

                    // 2. Obtener URL pública
                    const { data: urlData } = this.supabaseClient
                        .storage.from('course-uploads').getPublicUrl(fileName);
                    fileUrl = urlData.publicUrl;

                    // 3. Guardar en Tabla 'files'
                    const fileMetadata = {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        unit: unit,
                        lesson: lesson,
                        url: fileUrl,
                        upload_date: new Date().toISOString()
                    };

                    await this.supabaseClient.from('files').insert([fileMetadata]);
                }

                await this.loadFilesFromSupabase(); // Recargar lista
                this.notify(`¡${file.name} subido!`, 'success');
            } catch (error) {
                console.error('Error en subida:', error);
                this.notify('Error al subir archivo', 'error');
            } finally {
                this.setLoading(unit, lesson, false);
            }
        }
    }

    // --- UI & RENDER ---
    renderUploadedFiles() {
        document.querySelectorAll('.file-list').forEach(container => {
            const { unit, lesson } = container.dataset;
            const files = this.uploadedFiles.filter(f => f.unit === unit && f.lesson === lesson);

            if (files.length === 0) {
                container.innerHTML = '<div class="empty-state">No hay archivos entregados</div>';
                return;
            }

            container.innerHTML = files.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <span class="file-icon">${this.getFileIcon(file.type)}</span>
                        <div class="file-details">
                            <span class="file-name">${file.name}</span>
                            <span class="file-meta">${window.ERY.utils.formatFileSize(file.size)} • ${window.ERY.utils.formatDate(file.upload_date)}</span>
                        </div>
                    </div>
                    <div class="file-actions">
                        <a href="${file.url}" target="_blank" class="btn-action" title="Descargar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        </a>
                        <button class="btn-action delete" onclick="window.fileUploadManager.deleteFile(${file.id})" title="Eliminar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            `).join('');
        });
    }

    // --- ACCIONES ---
    async deleteFile(id) {
        if (!confirm('¿Estás seguro de eliminar este archivo?')) return;

        try {
            if (this.supabaseClient) {
                // El borrado en cascada debería manejar el Storage si está configurado, 
                // si no, borramos la entrada de la base de datos:
                await this.supabaseClient.from('files').delete().eq('id', id);
            }
            this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== id);
            this.saveToStorage();
            this.renderUploadedFiles();
            this.notify('Archivo eliminado', 'info');
        } catch (error) {
            this.notify('Error al eliminar', 'error');
        }
    }

    // --- UTILIDADES ---
    setupEventListeners() {
        // Drag & Drop
        document.querySelectorAll('.file-upload-area').forEach(area => {
            const input = area.querySelector('input[type="file"]');
            
            area.addEventListener('click', () => input.click());
            
            input.addEventListener('change', (e) => {
                const { unit, lesson } = input.dataset;
                this.handleFiles(e.target.files, unit, lesson);
            });

            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => area.classList.remove('dragover'));

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                const { unit, lesson } = input.dataset;
                this.handleFiles(e.dataTransfer.files, unit, lesson);
            });
        });
    }

    getFileIcon(type) {
        if (type.includes('pdf')) return '📕';
        if (type.includes('image')) return '🖼️';
        if (type.includes('word')) return '📘';
        return '📄';
    }

    setLoading(unit, lesson, isLoading) {
        const area = document.querySelector(`.file-upload-area[data-unit="${unit}"][data-lesson="${lesson}"]`);
        if (area) {
            area.classList.toggle('loading', isLoading);
            area.style.opacity = isLoading ? '0.5' : '1';
            area.style.pointerEvents = isLoading ? 'none' : 'auto';
        }
    }

    validateFile(file) {
        if (file.size > this.maxFileSize) {
            this.notify('El archivo es demasiado grande (Máx 10MB)', 'error');
            return false;
        }
        return true;
    }

    notify(m, t) { window.ERY.utils.showNotification(m, t); }
    loadFromStorage() { return JSON.parse(localStorage.getItem('ery_files') || '[]'); }
    saveToStorage() { localStorage.setItem('ery_files', JSON.stringify(this.uploadedFiles)); }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    const url = document.querySelector('meta[name="supabase-url"]')?.content;
    const key = document.querySelector('meta[name="supabase-key"]')?.content;
    window.fileUploadManager = new FileUploadManager(url, key);
});
