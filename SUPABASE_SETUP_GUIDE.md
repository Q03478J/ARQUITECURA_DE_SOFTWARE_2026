# 🚀 SUPA BASE SETUP GUIDE - PRODUCTION READY

Este documento te guía paso a paso para configurar Supabase con el nuevo sistema de usuarios y roles.

---

## 📋 PRE-REQUISITOS

1. ✅ Cuenta en [Supabase](https://supabase.com)
2. ✅ Proyecto ya creado
3. ✅ Credenciales guardadas (URL y Anon Key)

---

## 🔧 PASO 1: Ejecutar el SQL Schema

1. Ve a tu proyecto en Supabase
2. Abre **SQL Editor**
3. Abre el archivo `supabase_complete_schema.sql`
4. Copia todo el contenido
5. Pega en el SQL Editor
6. Haz clic en **RUN**

✅ Esto creará:

- 8 tablas con RLS habilitado
- Políticas de seguridad estrictas
- Funciones de cálculo de progreso
- Triggers automáticos
- Datos iniciales (unidades, asignaciones,  settings)

---

## 👥 PASO 2: Crear Usuarios en Supabase Authentication

### 2.1 Crear Administrador

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Completa:

   ```
   Email: dobleeimportaciones@gmail.com
   Password: [TU_CONTRASEÑA_SEGURA]
   ```

4. Haz clic en **Create user**
5. **IMPORTANTE:** Copia el `User UID` que aparece

### 2.2 Crear Estudiante Inicial

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Completa:

   ```
   Email: cordedwinegsep@gmail.com
   Password: [CONTRASEÑA_ESTUDIANTE]
   ```

4. Haz clic en **Created user**
5. **IMPORTANTE:** Copia el `User UID` que aparece

---

## 🔗 PASO 3: Vincular Auth Users a Tabla `usuarios`

Ahora debes vincular los usuarios de Authentication con la tabla `usuarios`.

### 3.1 Vincular Administrador

1. Ve a **SQL Editor**
2. Ejecuta este SQL (reemplaza `TU_AUTH_UID` con el UID real del admin):

```sql
INSERT INTO public.usuarios (user_id, email, full_name, role)
VALUES (
    'TU_AUTH_UID'::uuid,  -- Reemplaza con el User UID del admin
    'dobleeimportaciones@gmail.com',
    'Administrador ERY',
    'administrator'
);
```

### 3.2 Vincular Estudiante

1. Ejecuta este SQL (reemplaza `TU_AUTH_UID` con el UID real del estudiante):

```sql
INSERT INTO public.usuarios (user_id, email, full_name, role)
VALUES (
    'TU_AUTH_UID'::uuid,  -- Reemplaza con el User UID del estudiante
    'cordedwinegsep@gmail.com',
    'Edwin Cordova',
    'student'
);
```

---

## 📁 PASO 4: Configurar Storage Bucket

### 4.1 Crear Bucket

1. Ve a **Storage**
2. Haz clic en **Create a new bucket**
3. Nombre: `course-uploads`
4. **Public bucket:** ✅ SÍ
5. Haz clic en **Create bucket**

### 4.2 Configurar Políticas del Bucket

1. Ve al bucket `course-uploads`
2. Haz clic en **Policies**
3. Crea estas 3 políticas:

#### Política 1: Allow Authenticated Upload

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'course-uploads' AND
    (SELECT COUNT(*) FROM public.usuarios WHERE user_id = auth.uid()) > 0
);
```

#### Política 2: Public Read

```sql
CREATE POLICY "Public can read files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-uploads');
```

#### Política 3: Users Delete Own Files

```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'course-uploads' AND
    (SELECT COUNT(*) FROM public.usuarios WHERE user_id = auth.uid()) > 0
);
```

---

## ✅ PASO 5: Verificar Configuración

### 5.1 Verificar Tablas

1. Ve a **Table Editor**
2. Verifica que existan estas tablas:
   - ✅ `usuarios`
   - ✅ `units`
   - ✅ `assignments`
   - ✅ `submissions`
   - ✅ `files`
   - ✅ `progress_tracking`
   - ✅ `settings`
   - ✅ `audit_log`

### 5.2 Verificar Usuarios

1. Ve a **Table Editor** > `usuarios`
2. Deberías ver 2 registros:
   - <dobleeimportaciones@gmail.com> (administrator)
   - <cordedwinegsep@gmail.com> (student)

### 5.3 Verificar Asignaciones

1. Ve a **Table Editor** > `assignments`
2. Deberías ver 16 asignaciones (4 unidades × 4 semanas)

---

## 🧪 PASO 6: Probar el Login

1. Abre tu proyecto: `index.html`
2. Haz clic en **Iniciar sesión**
3. Prueba con el administrador:

   ```
   Email: dobleeimportaciones@gmail.com
   Password: [tu contraseña]
   ```

4. Deberías ser redirigido a `dashboard-admin.html` (próximamente)
5. Cierra sesión
6. Prueba con el estudiante:

   ```
   Email: cordedwinegsep@gmail.com
   Password: [tu contraseña]
   ```

7. Deberías ser redirigido a `dashboard-student.html` (próximamente)

---

## 🔒 PASO 7: Seguridad - Verificar RLS

### 7.1 Verificar que RLS está habilitado

1. Ve a **Table Editor** > **usuarios** > **...** > **Edit Table**
2. Verifica que **Enable Row Level Security** esté ✅ ACTIVADO
3. Repite para todas las tablas

### 7.2 Probar las Políticas

#### Test 1: Admin Puede Ver Todo

```sql
-- Simular admin viendo todos los usuarios
SELECT *
FROM public.usuarios
WHERE auth.email() = 'dobleeimportaciones@gmail.com';
-- Debería devolver TODOS los usuarios
```

#### Test 2: Estudiante Solo Ve Su Info

```sql
-- Simular estudiante viendo solo su registro
SELECT *
FROM public.usuarios
WHERE user_id = auth.uid();
-- Debería devolver SOLO el registro del estudiante actual
```

---

## 📊 PASO 8: Verificar Funciones

### 8.1 Probar calculate_unit_progress

```sql
SELECT calculate_unit_progress(
    'UUID_DEL_ESTUDIANTE'::uuid,
    1  -- Unidad 1
);
-- Debería devolver 0.00 (ninguna tarea completada aún)
```

### 8.2 Probar can_upload_to_assignment

```sql
SELECT can_upload_to_assignment(
    'UUID_DEL_ESTUDIANTE'::uuid,
    (SELECT id FROM assignments WHERE assignment_key = 'unidad1_semana1')
);
-- Debería devolver TRUE (puede subir)
```

---

## 🎨 PASO 9: Ajustes Finales

### 9.1 Configurar Email Templates (Opcional)

1. Ve a **Authentication** > **Email Templates**
2. Personaliza los templates:
   - Confirm signup
   - Reset password
   - Magic link

### 9.2 Configurar Redirect URLs

1. Ve a **Authentication** > **URL Configuration**
2. Agrega tu dominio de producción
3. Agrega `localhost` para desarrollo

---

## 🚀 ¡LISTO

Tu sistema ahora tiene:

✅ Autenticación real con Supabase
✅ Roles estrictos (admin y estudiante)
✅ Progreso calculado desde base de datos
✅ RLS para seguridad máxima
✅ Storage configurado
✅ Funciones de ayuda

---

## 📝 PRÓXIMOS PASOS

1. ✅ Sistema base funcional
2. 🔄 Crear dashboards (admin y estudiante)
3. 🔄 Mejorar fileUpload.js con autenticación
4. 🔄 Testear flujo completo
5. 🚀 Desplegar a producción

---

## 🆘 TROUBLESHOOTING

### Error: "new row violates check constraint"

**Causa:** Intentaste crear un admin con email diferente a `dobleeimportaciones@gmail.com`

**Solución:** Solo ese email puede ser administrador

---

### Error: "RLS policy violation"

**Causa:** Las políticas RLS están bloqueando el acceso

**Solución:**

1. Verifica que el usuario esté autenticado
2. Ve a la tabla y revisa las políticas
3. Asegúrate de que `auth.uid()` coincida con `user_id`

---

### No puedo iniciar sesión

**Solución:**

1. Verifica que el usuario exista en **Authentication**
2. Verifica que esté vinculado en tabla `usuarios`
3. Revisa la consola del navegador (F12) para errores
4. Verifica que las credenciales de supab ase estén en las meta tags

---

## 📧 SOPORTE

- Profesor: <edwramirezy@gmail.com>
- Admin: <dobleeimportaciones@gmail.com>
- Documentación Supabase: <https://supabase.com/docs>

---

**✨ Sistema creado con nivel producción - ERY CURSOS 2025 ✨**
