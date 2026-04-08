-- ===================================
-- TRIGGER PARA AUTO-CREAR PERFILES DE USUARIO
-- ===================================
-- INSTRUCCIONES:
-- 1. Copia este archivo completo
-- 2. Ve a https://supabase.com/dashboard
-- 3. Selecciona tu proyecto
-- 4. Ve a SQL Editor (icono </> en el menú)
-- 5. Click en "New Query"
-- 6. Pega este código completo
-- 7. Click en "RUN" (abajo a la derecha)
-- 8. Deberías ver: "Trigger creado exitosamente!"
-- ===================================
-- Función que se ejecuta cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
DECLARE user_role TEXT;
user_full_name TEXT;
BEGIN -- Obtener rol y nombre del metadata
user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
-- Insertar en tabla pública usuarios
INSERT INTO public.usuarios (user_id, email, full_name, role, active)
VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        user_role,
        true
    );
RETURN NEW;
EXCEPTION
WHEN unique_violation THEN -- Usuario ya existe, ignorar
RETURN NEW;
WHEN OTHERS THEN -- Log error pero no fallar
RAISE WARNING 'Could not create profile for user %: %',
NEW.id,
SQLERRM;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Crear el trigger
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Verificación
SELECT 'Trigger creado exitosamente!' AS status;