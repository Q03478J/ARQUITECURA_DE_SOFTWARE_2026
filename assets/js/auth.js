// ===================================
// AUTHENTICATION SYSTEM - ERY CURSOS
// SUPABASE AUTH & ROLE MANAGEMENT
// ===================================

class AuthManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.currentProfile = null;
        this.ADMIN_EMAIL = 'dobleeimportaciones@gmail.com';
        this.init();
    }

    async init() {
        const url = document.querySelector('meta[name="supabase-url"]')?.content;
        const key = document.querySelector('meta[name="supabase-key"]')?.content;

        if (!url || !key || !window.supabase) {
            console.error('❌ Configuración de Supabase no encontrada');
            return false;
        }

        try {
            this.supabaseClient = window.supabase.createClient(url, key);

            // ✅ CAMBIO 1: Exponer this en window.ERY.auth INMEDIATAMENTE
            // para que fileUpload.js pueda reutilizar supabaseClient
            window.ERY = window.ERY || {};
            window.ERY.auth = this;

            // Verificar sesión actual al cargar
            await this.checkSession();

            // Escuchar cambios de estado (Login/Logout)
            this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN') {
                    await this.handleSignIn(session);
                } else if (event === 'SIGNED_OUT') {
                    this.handleSignOut();
                }
                // ✅ CAMBIO 2: Notificar a fileUpload.js cuando cambia la sesión
                document.dispatchEvent(new Event('authStateChanged'));
            });

            return true;
        } catch (error) {
            console.error('Error inicializando Auth:', error);
            return false;
        }
    }

    // --- SESIÓN Y PERFIL ---
    async checkSession() {
        const { data: { session } } = await this.supabaseClient.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            await this.loadUserProfile();
            // ✅ Notificar también al verificar sesión inicial
            document.dispatchEvent(new Event('authStateChanged'));
            return true;
        }
        return false;
    }

    async loadUserProfile() {
        if (!this.currentUser) return null;
        try {
            const { data, error } = await this.supabaseClient
                .from('usuarios')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .single();

            if (error) throw error;
            this.currentProfile = data;
            return data;
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            return null;
        }
    }

    // --- ACCIONES DE USUARIO ---
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            
            await this.logAudit('SIGN_IN', 'auth');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, fullName, role = 'student') {
        try {
            const { data: { session: adminSession } } = await this.supabaseClient.auth.getSession();

            const { data: authData, error: authError } = await this.supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName, role: role } }
            });

            if (authError) throw authError;

            if (adminSession) {
                await this.supabaseClient.auth.setSession(adminSession);
            }

            const { error: profileError } = await this.supabaseClient
                .from('usuarios')
                .insert([{
                    user_id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    role: role,
                    active: true
                }]);

            if (profileError) throw profileError;

            await this.logAudit('CREATE_USER', 'usuarios', authData.user.id);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        await this.logAudit('SIGN_OUT', 'auth');
        await this.supabaseClient.auth.signOut();
        window.location.href = 'index.html';
    }

    // --- SEGURIDAD Y RUTAS ---
    isAdmin() {
        return this.currentProfile?.role === 'administrator' && this.currentProfile?.email === this.ADMIN_EMAIL;
    }

    protectRoute(requiredRole = null) {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return false;
        }

        if (requiredRole && this.currentProfile?.role !== requiredRole && !this.isAdmin()) {
            this.redirectToDashboard();
            return false;
        }
        return true;
    }

    redirectToDashboard() {
        const role = this.currentProfile?.role;
        const routes = {
            administrator: 'dashboard-admin.html',
            evaluator: 'dashboard-evaluator.html',
            assistant: 'dashboard-assistant.html',
            student: 'dashboard-student.html'
        };
        window.location.href = routes[role] || 'index.html';
    }

    // --- AUDITORÍA ---
    async logAudit(action, tableName, recordId = null) {
        try {
            const ip = await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip);
            await this.supabaseClient.from('audit_log').insert([{
                user_id: this.currentProfile?.id,
                action,
                table_name: tableName,
                record_id: recordId,
                ip_address: ip,
                user_agent: navigator.userAgent
            }]);
        } catch (e) { /* Silencioso */ }
    }
}

// ✅ Globalización — ya no llamamos init() dos veces
document.addEventListener('DOMContentLoaded', () => {
    window.ERY = window.ERY || {};
    window.ERY.auth = new AuthManager();
    // init() se llama automáticamente en el constructor
});
