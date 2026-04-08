# Guía del Administrador - ERY CURSOS

## Introducción

Esta guía explica cómo usar todas las funcionalidades del dashboard de administrador para gestionar el sistema de cursos.

## Acceso al Dashboard

1. Ir a `login.html`
2. Ingresar con credenciales de administrador:
   - Email: `dobleeimportaciones@gmail.com`
   - Password: Tu contraseña configurada
3. Serás redirigido automáticamente al Dashboard Administrador

---

## Gestión de Usuarios

### Crear Nuevo Usuario

1. Ve a la pestaña **"👥 Estudiantes"**
2. Haz clic en **"+ Crear Usuario"**
3. Llena el formulario:
   - Correo electrónico
   - Nombre completo
   - Selecciona el rol (Estudiante, Evaluador o Asistente)
   - Contraseña (mínimo 6 caracteres)
4. Haz clic en **"Crear"**

> **Nota**: Los usuarios creados recibirán un correo de confirmación si la configuración de Supabase lo permite.

### Editar Usuario

1. En la tabla de usuarios, haz clic en el botón **"✏️ Editar"**
2. Modifica el nombre o rol del usuario
3. Haz clic en **"Guardar Cambios"**

> **Importante**: El correo electrónico no se puede cambiar por seguridad.

### Activar/Desactivar Usuario

1. En la tabla de usuarios, haz clic en el botón **"🔒"** (Desactivar) o **"🔓"** (Activar)
2. Confirma la acción
3. Los usuarios desactivados no podrán iniciar sesión pero sus datos se conservan

---

## Gestión de Fechas Límite

### Establecer Fecha Límite

1. Ve a la pestaña **"📚 Asignaciones"**
2. Verás las 16 asignaciones (4 unidades × 4 semanas)
3. Haz clic en **"📅 Establecer"** o **"📅 Editar"** en la asignación deseada
4. Selecciona la fecha y hora límite
5. Haz clic en **"Guardar Fecha"**

### Quitar Fecha Límite

1. Abre el modal de edición de la asignación
2. Haz clic en **"Quitar Fecha"**
3. Confirma la acción

### Estados de Asignaciones

- **⚪ Sin fecha**: No tiene fecha límite establecida
- **✅ Activa**: Fecha límite está vigente (más de 3 días)
- **⚠️ Próxima**: Fecha límite en los próximos 3 días
- **❌ Vencida**: Fecha límite ha pasado

---

## Sistema de Calificaciones

### Calificar Entrega

1. Ve a la pestaña **"📝 Calificaciones"**
2. Verás las entregas pendientes de calificar
3. Usa el filtro para ver solo una unidad específica (opcional)
4. Haz clic en **"📝 Calificar"** en la entrega deseada
5. Ingresa la calificación (0-20, puedes usar medios: 15.5)
6. Escribe la retroalimentación (opcional pero recomendado)
7. Haz clic en **"Guardar Calificación"**

### Exportar Calificaciones

1. En la pestaña de Calificaciones
2. Selecciona filtro de unidad si deseas (opcional)
3. Haz clic en **"📊 Exportar CSV"**
4. Se descargará un archivo CSV con todas las calificaciones

El archivo incluirá:

- Nombre del estudiante
- Email
- Unidad
- Tarea
- Calificación
- Feedback
- Calificado por
- Fecha de calificación

---

## Sistema de Notificaciones

### Enviar Notificación

1. Ve a la pestaña **"🔔 Notificaciones"**
2. Haz clic en **"✉️ Nueva Notificación"**
3. Llena el formulario:
   - **Título**: Asunto de la notificación
   - **Mensaje**: Contenido del mensaje
   - **Destinatarios**: Selecciona a quién enviar
     - Todos los Estudiantes
     - Todos los Evaluadores
     - Todos los Asistentes
     - Todos los Usuarios
   - **Tipo**: Selecciona el tipo de notificación
     - Información (azul)
     - Advertencia (amarillo)
     - Éxito (verde)
     - Error (rojo)
4. Haz clic en **"Enviar Ahora"**

### Ver Historial

El historial de notificaciones muestra:

- Título
- Destinatarios
- Tipo
- Fecha de envío

---

## Configuración del Sistema

Ve a la pestaña **"⚙️ Configuración"** para ajustar:

### Tamaño Máximo de Archivo

1. Ingresa el nuevo tamaño en MB (1-50)
2. Haz clic en **"Actualizar"**

> **Recomendación**: 10MB es adecuado para la mayoría de entregas. Aumenta solo si es necesario.

### Entregas Tardías

- Marca o desmarca "Permitir entregas tardías"
- Esto afecta si los estudiantes pueden subir archivos después de la fecha límite

---

## Roles y Permisos

### Administrador (tú)

- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión de fechas límite
- ✅ Calificar entregas
- ✅ Enviar notificaciones
- ✅ Cambiar configuraciones
- ✅ Ver todas las estadísticas
- ✅ Exportar datos

### Evaluador

- ✅ Ver lista de estudiantes (solo lectura)
- ✅ Ver entregas pendientes
- ✅ Calificar entregas
- ✅ Exportar calificaciones
- ❌ NO puede crear/editar usuarios
- ❌ NO puede cambiar configuraciones
- ❌ NO puede gestionar fechas límite

### Asistente

- ✅ Ver lista de estudiantes
- ✅ Crear nuevos estudiantes
- ✅ Gestionar fechas límite
- ❌ NO puede editar/desactivar usuarios existentes
- ❌ NO puede calificar entregas
- ❌ NO puede cambiar configuraciones

### Estudiante

- ✅ Ver su propio progreso
- ✅ Subir archivos de tareas
- ✅ Ver sus calificaciones
- ❌ NO tiene acceso a dashboards administrativos

---

## Estadísticas del Dashboard

En la parte superior del dashboard verás 4 cards con estadísticas en tiempo real:

1. **Estudiantes Totales**: Número de estudiantes registrados
2. **Progreso Promedio**: Promedio del progreso de todos los estudiantes
3. **Tareas Entregadas**: Total de entregas realizadas
4. **Archivos Subidos**: Total de archivos en el sistema

En la pestaña de Calificaciones verás:

1. **Tareas Calificadas**: Número de entregas ya calificadas
2. **Pendientes**: Entregas esperando calificación
3. **Promedio General**: Promedio de todas las calificaciones (0-20)

---

## Tips y Buenas Prácticas

### 1. Gestión de Fechas

- ✅ Establece fechas límite con anticipación
- ✅ Deja al menos 1 semana entre asignaciones
- ✅ Revisa regularmente las fechas próximas a vencer

### 2. Calificaciones

- ✅ Proporciona feedback detallado a los estudiantes
- ✅ Califica de manera oportuna (máximo 1 semana)
- ✅ Usa la escala completa 0-20
- ✅ Exporta calificaciones regularmente como respaldo

### 3. Notificaciones

- ✅ Usa títulos claros y descriptivos
- ✅ Selecciona el tipo apropiado de notificación
- ✅ Envía recordatorios 2-3 días antes de fechas límite
- ❌ Evita enviar demasiadas notificaciones (máximo 2-3 por semana)

### 4. Gestión de Usuarios

- ✅ Verifica bien los datos antes de crear usuarios
- ✅ Usa desactivación en lugar de eliminar
- ✅ Asigna roles apropiados según responsabilidades
- ❌ No compartas credenciales de administrador

---

## Tareas Administrativas Comunes

### Inicio de Ciclo

1. Crear fechas límite para todas las 16 asignaciones
2. Crear cuentas de estudiantes
3. Enviar notificación de bienvenida
4. Configurar tamaño máximo de archivos

### Durante el Ciclo

1. Calificar entregas semanalmente
2. Enviar recordatorios de fechas próximas
3. Monitorear progreso de estudiantes
4. Responder consultas en el chatbot

### Fin de Ciclo

1. Calificar todas las entregas pendientes
2. Exportar calificaciones finales
3. Generar reporte de estadísticas
4. Enviar notificación de cierre

---

## Solución de Problemas

### Un estudiante no puede subir archivos

1. Verifica que el usuario esté activo
2. Revisa si la fecha límite ya pasó
3. Verifica configuración de "Permitir entregas tardías"
4. Comprueba que el tamaño del archivo no exceda el límite

### No puedo calificar una entrega

1. Verifica que la entrega esté en estado "submitted"
2. Comprueba que no haya sido calificada ya
3. Refresca la página e intenta nuevamente

### Las notificaciones no se envían

1. Verifica que seleccionaste destinatarios
2. Comprueba la consol del navegador (F12) por errores
3. Verifica conexión a Supabase

---

## Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Revisa la consola del navegador (F12) para errores
2. Verifica que Supabase esté correctamente configurado
3. Consulta el [README.md](README.md) para información técnica
4. Contacta al soporte técnico: <edwramirezy@gmail.com>

---

**Última actualización**: Diciembre 2025  
**Versión**: 2.0 con Sistema Completo de Gestión
