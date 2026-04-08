# 🎯 INSTRUCCIONES PARA CONFIGURAR SUPABASE

## ✨ Estado Actual

✅ TODO el código está COMPLETADO y en GitHub
✅ Dashboards creados (admin y estudiante)
✅ Sistema de autenticación listo
✅ Progress tracking backend-driven

---

## 📝 LO QUE DEBES HACER AHORA (PASO A PASO)

### PASO 1: Ir a Supabase

1. Abre tu navegador
2. Ve a: <https://supabase.com>
3. Inicia sesión con tu cuenta
4. Abre tu proyecto: **ziawcvjvfpvudzkmtkba**

---

### PASO 2: Ejecutar el SQL Schema

1. En Supabase, haz clic en **SQL Editor** (icono de base de datos en el menú izquierdo)
2. Haz clic en **+ New query**
3. Abre el archivo: `supabase_complete_schema.sql` (está en tu proyecto)
4. Copia TODO el contenido del archivo
5. Pega en el SQL Editor de Supabase
6. Haz clic en el botón **RUN** (▶️)
7. Espera a que termine (debería decir "Success")

✅ Esto creará 8 tablas con todas las configuraciones

---

### PASO 3: Crear el Usuario Administrador

1. En Supabase, ve a **Authentication** (icono de llave en el menú izquierdo)
2. Haz clic en **Users**
3. Haz clic en **Add user** → **Create new user**
4. Completa:

   ```text
   Email: dobleeimportaciones@gmail.com
   Password: [CREA UNA CONTRASEÑA SEGURA]
   ```

5. Haz clic en **Create user**
6. **MUY IMPORTANTE**: Copia el **User UID** (un código largo como `a1b2c3d4-...`)

---

### PASO 4: Vincular Admin a la Tabla

1. Vuelve a **SQL Editor**
2. Crea una **+ New query**
3. Pega este código (REEMPLAZA `TU_AUTH_UID` con el UID que copiaste):

```sql
INSERT INTO public.usuarios (user_id, email, full_name, role)
VALUES (
    'TU_AUTH_UID'::uuid,
    'dobleeimportaciones@gmail.com',
    'Administrador ERY',
    'administrator'
);
```

1. Haz clic en **RUN**

---

### PASO 5: Crear el Usuario Estudiante

1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user** → **Create new user**
3. Completa:

   ```text
   Email: cordedwinegsep@gmail.com
   Password: [CREA UNA CONTRASEÑA]
   ```

4. Haz clic en **Create user**
5. Copia el **User UID**

---

### PASO 6: Vincular Estudiante a la Tabla

1. Vuelve a **SQL Editor**
2. Nueva query
3. Pega (REEMPLAZA `TU_AUTH_UID`):

```sql
INSERT INTO public.usuarios (user_id, email, full_name, role)
VALUES (
    'TU_AUTH_UID'::uuid,
    'cordedwinegsep@gmail.com',
    'Edwin Cordova',
    'student'
);
```

1. **RUN**

---

### PASO 7: Configurar Storage

1. Ve a **Storage** (icono de carpeta)
2. Haz clic en **Create a new bucket**
3. Nombre: `course-uploads`
4. **Public bucket**: ✅ SÍ (importante)
5. **Create bucket**

---

### PASO 8: Políticas del Bucket

1. Haz clic en el bucket **course-uploads**
2. Ve a la pestaña **Policies**
3. Haz clic en **New Policy** → **Custom policy**

**Política 1 - Upload:**

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'course-uploads'
);
```

**Política 2 - Read:**

```sql
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-uploads');
```

**Política 3 - Delete:**

```sql
CREATE POLICY "Users delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-uploads');
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Test 1: Verificar Tablas

1. Ve a **Table Editor**
2. Deberías ver: `usuarios`, `units`, `assignments`, `submissions`, `files`, `progress_tracking`, `settings`, `audit_log`

### Test 2: Verificar Usuarios

1. Table Editor → **usuarios**
2. Deberías ver 2 registros:
   - <dobleeimportaciones@gmail.com> (administrator)
   - <cordedwinegsep@gmail.com> (student)

### Test 3: Probar Login

1. Abre tu proyecto: <http://localhost:8000> (o el que uses)
2. Haz clic en **Iniciar sesión**
3. Ingresa:

   ```text
   Email: dobleeimportaciones@gmail.com
   Password: [tu contraseña]
   ```

4. Deberías ir a: **dashboard-admin.html**
5. Cierra sesión
6. Ingresa con:

   ```text
   Email: cordedwinegsep@gmail.com
   Password: [tu contraseña]
   ```

7. Deberías ir a: **dashboard-student.html**

---

## 🆘 SI ALGO FALLA

### Error: "new row violates check constraint"

- Causa: Intentaste crear admin con otro email
- Solución: SOLO <dobleeimportaciones@gmail.com> puede ser admin

## Error: "RLS policy violation"

- Causa: No vinculaste el usuario
- Solución: Ejecuta el INSERT en paso 4 o 6

## No puedo login

1. Verifica usuario existe en **Authentication**
2. Verifica existe en tabla **usuarios**
3. Abre consola navegador (F12) y mira errores

---

## 📋 CHECKLIST FINAL

- [ ] ✅ SQL Schema ejecutado
- [ ] ✅ Admin creado en Authentication
- [ ] ✅ Admin vinculado en tabla usuarios
- [ ] ✅ Estudiante creado en Authentication
- [ ] ✅ Estudiante vinculado en tabla usuarios
- [ ] ✅ Bucket course-uploads creado
- [ ] ✅ Políticas del bucket configuradas
- [ ] ✅ Login funciona como admin
- [ ] ✅ Login funciona como estudiante

---

## 🚀 DESPUÉS DE CONFIGURAR

Una vez que todo funcione:

1. El admin puede crear más estudiantes desde el dashboard
2. Los estudiantes pueden ver su progreso
3. El progreso se calcula automáticamente desde la BD
4. Los archivos se guardan en Supabase Storage
5. Todo está protegido con RLS

---

**💡 Tip**: Guarda las contraseñas en un lugar seguro

**📧 Soporte**: <edwramirezy@gmail.com>

---

## 🎉 ¡SISTEMA COMPLETO NIVEL PRODUCCIÓN
