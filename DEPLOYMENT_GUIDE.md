# 🚀 GUÍA DE DEPLOYMENT PASO A PASO

## ⚠️ IMPORTANTE: EJECUTA ESTOS PASOS EN ORDEN

Esta guía te ayudará a activar todas las nuevas funcionalidades del sistema ERY CURSOS.

---

## PASO 1: Actualizar Base de Datos en Supabase ⚠️ CRÍTICO

### 1.1 Abrir Supabase Dashboard

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **ERY CURSOS**

### 1.2 Ejecutar Schema SQL

1. En el menú lateral, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**
3. Abre el archivo `supabase_complete_schema.sql` de tu proyecto
4. **Copia TODO el contenido** del archivo
5. **Pega** el contenido en el editor SQL de Supabase
6. Haz clic en **"Run"** (botón verde abajo a la derecha)
7. **Espera** a que termine la ejecución (puede tardar 10-15 segundos)

### 1.3 Verificar que se ejecutó correctamente

Deberías ver mensajes como:

```
CREATE TABLE
CREATE INDEX
CREATE POLICY
...
Success. No rows returned
```

Si ves errores, **NO CONTINÚES**. Copia el error y pídeme ayuda.

### 1.4 Verificar Tablas Creadas

1. En el menú lateral, haz clic en **"Table Editor"**
2. Busca estas tablas:
   - ✅ `usuarios` (debe tener columna `role` con 4 opciones)
   - ✅ `grades` ⭐ NUEVA
   - ✅ `notifications` ⭐ NUEVA
   - ✅ `assignments`
   - ✅ `submissions`
   - ✅ `files`
   - ✅ `progress_tracking`
   - ✅ `settings`

3. Haz clic en la tabla `usuarios`
4. Verifica que existe la columna `role`
5. Haz clic en la columna `role` → deberías ver que acepta: `administrator`, `student`, `evaluator`, `assistant`

---

## PASO 2: Crear Usuarios de Prueba

### 2.1 Crear Usuario Evaluador

**Opción A - Desde Dashboard Admin (Recomendado):**

1. Abre tu sitio: `https://edwram2025.github.io/PORT_EDWIN/login.html`
2. Inicia sesión como administrador:
   - Email: `dobleeimportaciones@gmail.com`
   - Password: Tu contraseña
3. En el Dashboard Admin, haz clic en **"+ Crear Usuario"**
4. Llena el formulario:
   - Email: `evaluador@test.com`
   - Nombre: `Evaluador de Prueba`
   - Rol: `Evaluador`
   - Password: `Test123!`
5. Haz clic en **"Crear"**

**Opción B - Desde Supabase SQL Editor:**

```sql
-- 1. Crear en auth.users (en Authentication > Users > Add user)
-- O ejecutar este SQL:

-- 2. Luego vincularen tabla usuarios:
INSERT INTO public.usuarios (user_id, email, full_name, role, active)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'evaluador@test.com'),
    'evaluador@test.com',
    'Evaluador de Prueba',
    'evaluator',
    true
);
```

### 2.2 Crear Usuario Asistente

Repite el proceso anterior pero con:

- Email: `asistente@test.com`
- Nombre: `Asistente de Prueba`
- Rol: `Asistente`
- Password: `Test123!`

---

## PASO 3: Probar Funcionalidades

### 3.1 Probar como Administrador

1. Login en: `https://edwram2025.github.io/PORT_EDWIN/login.html`
2. Email: `dobleeimportaciones@gmail.com`
3. Deberías ser redirigido a `dashboard-admin.html`

**Pruebas a realizar:**

✅ **Gestión de Usuarios:**

- [ ] Ver lista de todos los usuarios
- [ ] Crear un nuevo estudiante
- [ ] Editar un usuario (cambiar nombre o rol)
- [ ] Desactivar un usuario
- [ ] Reactivar un usuario

✅ **Gestión de Fechas:**

- [ ] Ver las 16 asignaciones
- [ ] Establecer fecha límite en "Unidad I - Semana 1"
- [ ] Editar la fecha límite
- [ ] Verificar que el estado cambia (⚪→✅→⚠️)

✅ **Sistema de Calificaciones:**

- [ ] IR a pestaña "Calificaciones"
- [ ] Ver estadísticas (si hay entregas)
- [ ] Calificar una entrega pendiente (si existe)
- [ ] Exportar calificaciones a CSV

✅ **Sistema de Notificaciones:**

- [ ] Ir a pestaña "Notificaciones"
- [ ] Crear una notificación de prueba:
  - Título: "Prueba de Sistema"
  - Mensaje: "Esto es una prueba"
  - Destinatarios: "Todos los Estudiantes"
  - Tipo: "Información"
- [ ] Enviar
- [ ] Ver en el historial

### 3.2 Probar como Evaluador

1. **Cerrar sesión** del admin
2. Login con:
   - Email: `evaluador@test.com`
   - Password: `Test123!`
3. Deberías ser redirigido a `dashboard-evaluator.html`

**Pruebas a realizar:**

✅ **Permisos Correctos:**

- [ ] Ves 3 pestañas: Pendientes, Calificadas, Estudiantes
- [ ] Ves estadísticas de calificación
- [ ] Puedes ver lista de estudiantes (solo lectura)
- [ ] Puedes exportar calificaciones

✅ **Restricciones:**

- [ ] NO ves opción para crear usuarios
- [ ] NO ves opción para gestionar fechas límite
- [ ] NO ves pestaña de Configuración

### 3.3 Probar como Asistente

1. **Cerrar sesión**
2. Login con:
   - Email: `asistente@test.com`
   - Password: `Test123!`
3. Deberías ser redirigido a `dashboard-assistant.html`

**Pruebas a realizar:**

✅ **Permisos Correctos:**

- [ ] Ves 2 pestañas: Estudiantes, Asignaciones
- [ ] Puedes crear nuevos estudiantes
- [ ] Puedes establecer fechas límite
- [ ] Ves estadísticas: Estudiantes activos, Asignaciones, Fechas próximas

✅ **Restricciones:**

- [ ] NO puedes editar usuarios existentes
- [ ] NO puedes desactivar usuarios
- [ ] NO puedes calificar entregas
- [ ] NO ves pestaña de Configuración

---

## PASO 4: Verificar Políticas RLS

### 4.1 Verificar en Supabase Dashboard

1. Ve a **Authentication > Policies**
2. Selecciona tabla `grades`
3. Deberías ver políticas como:
   - "Evaluators can create grades"
   - "Evaluators can read grades"
   - etc.

### 4.2 Prueba de Seguridad

Intenta que un **evaluador**:

- ❌ Cree un usuario → DEBE FALLAR
- ❌ Cambie configuraciones → DEBE FALLAR
- ✅ Califique una entrega → DEBE FUNCIONAR

Intenta que un **asistente**:

- ❌ Califique una entrega → DEBE FALLAR
- ❌ Desactive un usuario → DEBE FALLAR
- ✅ Cree un estudiante → DEBE FUNCIONAR
- ✅ Establezca fecha límite → DEBE FUNCIONAR

---

## PASO 5: Deploy y Verificación Final

### 5.1 Verificar en GitHub Pages

Tu sitio está en: `https://edwram2025.github.io/PORT_EDWIN/`

Verifica que existan estos archivos:

- ✅ `dashboard-admin.html`
- ✅ `dashboard-evaluator.html`
- ✅ `dashboard-assistant.html`
- ✅ `js/admin-users.js`
- ✅ `js/admin-assignments.js`
- ✅ `js/grading.js`
- ✅ `js/notifications.js`
- ✅ `js/dashboard-admin.js`

### 5.2 Prueba Cross-Browser

Prueba en:

- [ ] Chrome
- [ ] Firefox
- [ ] Edge

### 5.3 Prueba en Dispositivos

- [ ] Desktop
- [ ] Tablet (si tienes)
- [ ] Mobile

---

## PASO 6: Documentación para Usuarios

### 6.1 Compartir Guía del Administrador

El archivo `ADMIN_GUIDE.md` contiene instrucciones completas para:

- Crear usuarios
- Gestionar fechas límite
- Calificar entregas
- Enviar notificaciones

### 6.2 Capacitar a Evaluadores

Envía estas credenciales a tus evaluadores:

- URL: `https://edwram2025.github.io/PORT_EDWIN/login.html`
- Sus credenciales de acceso
- Explicación de sus permisos

### 6.3 Capacitar a Asistentes

Similar a evaluadores, pero explica que:

- Pueden crear estudiantes
- Pueden gestionar fechas límite
- NO pueden calificar

---

## ✅ CHECKLIST FINAL

Marca cada item cuando lo completes:

### Base de Datos

- [ ] Ejecutar `supabase_complete_schema.sql` en Supabase
- [ ] Verificar tabla `grades` existe
- [ ] Verificar tabla `notifications` existe
- [ ] Verificar políticas RLS creadas

### Usuarios

- [ ] Crear usuario evaluador de prueba
- [ ] Crear usuario asistente de prueba
- [ ] Probar login de cada rol

### Funcionalidades Admin

- [ ] CRUD de usuarios funciona
- [ ] Gestión de fechas funciona
- [ ] Sistema de calificaciones funciona
- [ ] Sistema de notificaciones funciona
- [ ] Exportación a CSV funciona

### Funcionalidades Evaluador

- [ ] Login redirige a dashboard correcto
- [ ] Puede calificar entregas
- [ ] Puede exportar calificaciones
- [ ] NO puede crear usuarios (verificado)
- [ ] NO puede gestionar fechas (verificado)

### Funcionalidades Asistente

- [ ] Login redirige a dashboard correcto
- [ ] Puede crear estudiantes
- [ ] Puede gestionar fechas límite
- [ ] NO puede calificar (verificado)
- [ ] NO puede editar usuarios (verificado)

### Seguridad

- [ ] Políticas RLS validadas
- [ ] Permisos de cada rol verificados
- [ ] No hay acceso no autorizado

### Deploy

- [ ] Código en GitHub actualizado
- [ ] GitHub Pages funcionando
- [ ] Todos los archivos accesibles

---

## 🐛 TROUBLESHOOTING

### Error al ejecutar SQL

**Problema**: "relation already exists"
**Solución**: Está bien, significa que la tabla ya existe. Continúa.

### Error: "permission denied for table"

**Problema**: RLS no permite la acción
**Solución**: Verifica que ejecutaste TODAS las políticas del schema SQL.

### Usuario no se puede crear

**Problema**: Email duplicado o error de validación
**Solución**:

1. Ve a Supabase > Authentication > Users
2. Verifica que el email no exista
3. Si existe, elimínalo y crea uno nuevo

### Dashboard no carga</p>

**Problema**: Error en consola del navegador
**Solución**:

1. Presiona F12 para abrir DevTools
2. Ve a la pestaña "Console"
3. Copia el error
4. Verifica que todos los archivos JS estén en GitHub

### Notificaciones no se envían

**Problema**: Error al insertar en tabla notifications
**Solución**: Verifica que la tabla `notifications` exista y tenga políticas RLS.

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa la consola del navegador (F12 → Console)
2. Revisa los logs de Supabase (Dashboard → Logs)
3. Consulta `ADMIN_GUIDE.md` para instrucciones detalladas
4. Contacta al desarrollador si el problema persiste

---

## 🎉 ¡COMPLETADO

Una vez que todos los items del checklist estén marcados:

✅ Tu sistema está completamente funcional  
✅ Todos los roles están operativos  
✅ Las funcionalidades administrativas están activas  
✅ La seguridad está implementada  

**¡Felicitaciones! El sistema ERY CURSOS 2.0 está listo para producción! 🚀**

---

**Desarrollado por**: Antigravity AI  
**Versión**: 2.0 - Sistema Completo de Gestión Educativa  
**Fecha**: Diciembre 2025
