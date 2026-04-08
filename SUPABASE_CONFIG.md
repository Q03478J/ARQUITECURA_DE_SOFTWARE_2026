# CONFIGURACIÓN DE SUPABASE

Este documento explica cómo configurar Supabase para el portafolio de Arquitectura de Software.

## 1. Crear Cuenta y Proyecto

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Guarda la contraseña de la base de datos (la necesitarás)

## 2. Configurar Storage

### Crear el Bucket

1. En el panel de Supabase, ve a **Storage**
2. Haz clic en **Create a new bucket**
3. Nombre del bucket: `course-uploads`
4. Marca como **Public** bucket
5. Haz clic en **Create bucket**

### Configurar Políticas de Seguridad

Ve a **Storage** > **Policies** y configura las siguientes políticas:

#### Política 1: Permitir Subida Pública

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'course-uploads');
```

#### Política 2: Permitir Lectura Pública

```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-uploads');
```

#### Política 3: Permitir Eliminar Archivos

```sql
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'course-uploads');
```

## 3. Obtener Credenciales

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL**: Tu URL de Supabase
   - **anon/public key**: Tu clave pública

## 4. Configurar el Proyecto

Abre cada archivo HTML (`index.html`, `unidad1.html`, etc.) y actualiza las meta tags:

```html
<meta name="supabase-url" content="https://tu-proyecto.supabase.co">
<meta name="supabase-key" content="tu-clave-anon-publica">
```

**⚠️ IMPORTANTE**: La clave `anon` es segura para usar en el frontend. NO uses la clave `service_role` en el navegador.

## 5. Verificar Funcionamiento

1. Abre el proyecto en tu navegador
2. Ve a cualquier unidad (ej: `unidad1.html`)
3. Prueba subir un archivo usando el área de carga
4. Verifica en Supabase Storage que el archivo se haya subido

## 6. Estructura de Almacenamiento

Los archivos se organizan automáticamente:

```
course-uploads/
├── unidad1/
│   ├── semana1/
│   │   └── [timestamp]_archivo.pdf
│   ├── semana2/
│   └── ...
├── unidad2/
│   └── ...
├── unidad3/
│   └── ...
└── unidad4/
    └── ...
```

## 7. Límites de la Versión Gratuita

- **Storage**: 1 GB
- **Bandwidth**: 2 GB/mes
- **Archivos**: Sin límite de cantidad

Si necesitas más espacio, considera actualizar a un plan de pago.

## 8. Uso sin Supabase (Opcional)

Si no configuras Supabase, el sistema funcionará igualmente pero:

- Los archivos NO se subirán a la nube
- Solo se guardará metadata en localStorage
- Los archivos estarán disponibles solo en el navegador local

## 9. Troubleshooting

### Error: "Failed to fetch"

- Verifica que la URL de Supabase sea correcta
- Asegúrate de que el bucket exista y sea público

### Error: "Row Level Security"

- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el bucket sea público

### Los archivos no aparecen

- Abre la consola del navegador (F12)
- Revisa si hay errores en la pestaña Console
- Verifica que el bucket name sea exactamente `course-uploads`

## 10. Seguridad

### Validación de Archivos

El sistema valida:

- Tamaño máximo: 10 MB
- Tipos permitidos: PDF, Word, PowerPoint, imágenes, ZIP

### Mejoras Recomendadas para Producción

1. **Autenticación**: Implementar login para que solo usuarios autenticados suban archivos
2. **Rate Limiting**: Limitar cantidad de archivos por usuario/hora
3. **Escaneo de Malware**: Usar servicios como VirusTotal API
4. **Firma de URLs**: Generar URLs temporales en lugar de públicas

## Soporte

Para más información, consulta la [documentación oficial de Supabase](https://supabase.com/docs).
