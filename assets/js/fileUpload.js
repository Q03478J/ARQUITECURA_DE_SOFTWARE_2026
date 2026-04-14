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
            console.log('✅ Supabase conectado correctamente');
            return true;
        }
        console.error('❌ Supabase no pudo inicializarse');
        return false;
    }

    async loadFilesFromSupabase() {
        try {
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
                // Nombre único para evitar colisiones
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const fileName = `${unit}/${lesson}/${Date.now()}_${safeName}`;

                // 1. Subir al bucket 'tareas'
                const { data: storageData, error: storageError } = await this.supabaseClient
                    .storage
                    .from('tareas')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (storageError) {
                    console.error('Error storage:', storageError);
                    throw new Error(`Error al subir archivo: ${storageError.message}`);
                }

                // 2. Obtener URL pública
                const { data: urlData } = this.supabaseClient
                    .storage
                    .from('tareas')
                    .getPublicUrl(fileName);

                const fileUrl = urlData.publicUrl;

                // 3. Guardar metadatos en tabla 'files'
                const fileMetadata = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    unit: unit,
                    lesson: lesson,
                    url: fileUrl,
                    upload_date: new Date().toISOString()
                };

                const { error: insertError } = await this.supabaseClient
                    .from('files')
                    .insert([fileMetadata]);

                if (insertError) {
                    console.error('Error insert:', insertError);
                    throw new Error(`Error al guardar metadatos: ${insertError.message}`);
                }

                await this.loadFilesFromSupabase();
                this.renderUploadedFiles();
                this.notify(`✅ ${file.name} subido correctamente!`, 'success');

            } catch (error) {
                console.error('Error detallado:', error);
                this.notify(`❌ Error: ${error.message}`, 'error');
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
                    
                </div>
            `).join('');
        });
    }

    async deleteFile(id) {
        if (!confirm('¿Deseas eliminar esta entrega?')) return;

        try {
            if (this.supabaseClient) {
                const { error } = await this.supabaseClient
                    .from('files')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
            }
            this.uploadedFiles = this.uploadedFiles.filter(f => f.id != id);
            this.saveToStorage();
            this.renderUploadedFiles();
            this.notify('Archivo eliminado', 'info');
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.notify('Error al eliminar', 'error');
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.file-upload-area').forEach(area => {
            const input = area.querySelector('input[type="file"]');
            if (!input) return;

            area.addEventListener('click', (e) => {
                if (e.target !== input) input.click();
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
        if (!type) return '📄';
        if (type.includes('pdf')) return '📕';
        if (type.includes('image')) return '🖼️';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('sheet') || type.includes('excel')) return '📊';
        if (type.includes('zip') || type.includes('rar')) return '🗜️';
        return '📄';
    }

    setLoading(unit, lesson, isLoading) {
        const input = document.querySelector(`.file-upload-input[data-unit="${unit}"][data-lesson="${lesson}"]`);
        const area = input?.closest('.file-upload-area');
        if (area) {
            area.style.opacity = isLoading ? '0.5' : '1';
            area.style.pointerEvents = isLoading ? 'none' : 'auto';
            const text = area.querySelector('.file-upload-text');
            if (text) {
                text.innerText = isLoading
                    ? '⏳ Subiendo a la nube...'
                    : 'Arrastra archivos aquí o haz clic para seleccionar';
            }
        }
    }

    validateFile(file) {
        if (file.size > this.maxFileSize) {
            this.notify(`❌ "${file.name}" supera los 10MB permitidos.`, 'error');
            return false;
        }
        return true;
    }

    notify(msg, type) {
        if (window.ERY?.utils?.showNotification) {
            window.ERY.utils.showNotification(msg, type);
        } else {
            // Notificación visual simple si no hay sistema de notificaciones
            const div = document.createElement('div');
            div.textContent = msg;
            div.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                padding: 12px 20px; border-radius: 8px; font-size: 0.9rem;
                color: white; font-weight: 500; max-width: 350px;
                background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 4000);
        }
    }

    loadFromStorage() { return JSON.parse(localStorage.getItem('ery_files') || '[]'); }
    saveToStorage() { localStorage.setItem('ery_files', JSON.stringify(this.uploadedFiles)); }
}

// ===================================
// INICIALIZACIÓN AUTOMÁTICA
// Lee las credenciales desde los meta tags del HTML
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const url = document.querySelector('meta[name="supabase-url"]')?.content;
    const key = document.querySelector('meta[name="supabase-key"]')?.content;

    if (url && key) {
        window.fileUploadManager = new FileUploadManager(url, key);
    } else {
        console.error('❌ No se encontraron las credenciales de Supabase en los meta tags.');
        console.info('Agrega esto en el <head> de tu HTML:');
        console.info('<meta name="supabase-url" content="TU_URL">');
        console.info('<meta name="supabase-key" content="TU_ANON_KEY">');
    }
});
