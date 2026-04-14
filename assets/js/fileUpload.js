// ===================================
// FILE UPLOAD SYSTEM - CORONEL_GUEVARA
// SUPABASE STORAGE & DATABASE SYNC
// ===================================

class FileUploadManager {
    constructor(supabaseUrl = null, supabaseKey = null) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.supabaseClient = null;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
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

    async loadFilesFromSupabase() {
        try {
            // Intentamos traer los registros de la tabla 'files'
            const { data, error } = await this.supabaseClient
                .from('files')
                .select('*')
                .order('upload_date', { ascending: false });

            if (error) throw error;
            this.uploadedFiles = data || [];
            this.saveToStorage(); 
        } catch (error) {
            console.error('Error cargando archivos:', error);
            this.uploadedFiles = this.loadFromStorage();
        }
    }

    async handleFiles(files, unit, lesson) {
        if (!this.supabaseClient) {
            this.notify('Error: Supabase no configurado', 'error');
            return;
        }

        for (let file of files) {
            if (!this.validateFile(file)) continue;

            this.setLoading(unit, lesson, true);

            try {
                // Ruta: unidad1/semana1/123456789_nombre.pdf
                const fileName = `${unit}/${lesson}/${Date.now()}_${file.name}`;

                // 1. Subir al Bucket 'tareas' (Asegúrate que se llame así en tu panel)
                const { data: storageData, error: storageError } = await this.supabaseClient
                    .storage.from('tareas').upload(fileName, file);
                
                if (storageError) throw storageError;

                // 2. Obtener URL pública
                const { data: urlData } = this.supabaseClient
                    .storage.from('tareas').getPublicUrl(fileName);
                
                const fileUrl = urlData.publicUrl;

                // 3. Guardar metadatos en Tabla 'files'
                const fileMetadata = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    unit: unit,
                    lesson: lesson,
                    url: fileUrl,
                    upload_date: new Date().toISOString()
                };

                const { error: insertError } = await this.supabaseClient.from('files').insert([fileMetadata]);
                if (insertError) throw insertError;

                await this.loadFilesFromSupabase(); 
                this.renderUploadedFiles();
                this.notify(`¡${file.name} subido correctamente!`, 'success');

            } catch (error) {
                console.error('Error detallado:', error);
                this.notify('Error al subir a Supabase', 'error');
            } finally {
                this.setLoading(unit, lesson, false);
            }
        }
    }

    renderUploadedFiles() {
        document.querySelectorAll('.file-list').forEach(container => {
            const { unit, lesson } = container.dataset;
            const files = this.uploadedFiles.filter(f => f.unit === unit && f.lesson === lesson);

            if (files.length === 0) {
                container.innerHTML = '<div style="font-size: 0.8rem; color: #888; margin-top: 10px;">Sin entregas aún.</div>';
                return;
            }

            container.innerHTML = files.map(file => `
                <div class="file-item animate-fade-in" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; margin-top: 8px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${this.getFileIcon(file.type)}</span>
                        <div style="display: flex; flex-direction: column;">
                            <a href="${file.url}" target="_blank" style="font-size: 0.9rem; color: var(--color-primary); text-decoration: none; font-weight: 500;">${file.name}</a>
                            <small style="font-size: 0.7rem; color: #666;">${new Date(file.upload_date).toLocaleDateString()}</small>
                        </div>
                    </div>
                    <button onclick="window.fileUploadManager.deleteFile('${file.id}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; padding: 5px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `).join('');
        });
    }

    async deleteFile(id) {
        if (!confirm('¿Deseas eliminar esta entrega?')) return;

        try {
            if (this.supabaseClient) {
                await this.supabaseClient.from('files').delete().eq('id', id);
            }
            this.uploadedFiles = this.uploadedFiles.filter(f => f.id != id);
            this.saveToStorage();
            this.renderUploadedFiles();
            this.notify('Archivo eliminado', 'info');
        } catch (error) {
            this.notify('Error al eliminar', 'error');
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.file-upload-area').forEach(area => {
            const input = area.querySelector('input[type="file"]');
            if (!input) return;
            
            area.addEventListener('click', (e) => {
                if(e.target !== input) input.click();
            });
            
            input.addEventListener('change', (e) => {
                const { unit, lesson } = input.dataset;
                this.handleFiles(e.target.files, unit, lesson);
            });

            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.style.borderColor = 'var(--color-primary)';
                area.style.background = 'rgba(var(--color-primary-rgb), 0.05)';
            });

            area.addEventListener('dragleave', () => {
                area.style.borderColor = '';
                area.style.background = '';
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.style.borderColor = '';
                area.style.background = '';
                const { unit, lesson } = input.dataset;
                this.handleFiles(e.dataTransfer.files, unit, lesson);
            });
        });
    }

    getFileIcon(type) {
        if (type && type.includes('pdf')) return '📕';
        return '📄';
    }

    setLoading(unit, lesson, isLoading) {
        const area = document.querySelector(`.file-upload-input[data-unit="${unit}"][data-lesson="${lesson}"]`)?.closest('.file-upload-area');
        if (area) {
            area.style.opacity = isLoading ? '0.5' : '1';
            area.style.pointerEvents = isLoading ? 'none' : 'auto';
            const text = area.querySelector('.file-upload-text');
            if (text && isLoading) text.innerText = 'Subiendo a la nube...';
            if (text && !isLoading) text.innerText = 'Arrastra archivos aquí o haz clic para seleccionar';
        }
    }

    validateFile(file) {
        if (file.size > this.maxFileSize) {
            alert('El archivo supera los 10MB permitidos.');
            return false;
        }
        return true;
    }

    notify(msg, type) {
        // Intenta usar tu sistema de notificaciones, si no, usa alert
        if (window.ERY?.utils?.showNotification) {
            window.ERY.utils.showNotification(msg, type);
        } else {
            alert(msg);
        }
    }

    loadFromStorage() { return JSON.parse(localStorage.getItem('ery_files') || '[]'); }
    saveToStorage() { localStorage.setItem('ery_files', JSON.stringify(this.uploadedFiles)); }
}

// Inicialización Automática
document.addEventListener('DOMContentLoaded', () => {
    const url = document.querySelector('meta[name="supabase-url"]')?.content;
    const key = document.querySelector('meta[name="supabase-key"]')?.content;
    
    if (url && key) {
        window.fileUploadManager = new FileUploadManager(url, key);
    } else {
        console.error("No se encontraron las credenciales de Supabase en los meta tags.");
    }
});
