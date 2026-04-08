# 🚀 PRÓXIMOS PASOS PARA SUBIR A GITHUB

## ✅ LO QUE YA ESTÁ HECHO

1. ✅ Repositorio Git inicializado
2. ✅ Todos los archivos agregados
3. ✅ Primer commit realizado

## 📝 PASOS PARA SUBIR A GITHUB

### 1. Crear el Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `PORTAFOLIO_ERY_CURSOS`
   - **Description**: `Plataforma educativa moderna para Arquitectura de Software con Supabase`
   - **Public** o **Private** (tu elección)
   - **NO** marcar "Initialize this repository with a README"
   - Haz clic en **"Create repository"**

### 2. Conectar y Subir desde la Terminal

Ejecuta estos comandos en PowerShell (ya estás en el directorio correcto):

```powershell
# Conectar con tu repositorio de GitHub (REEMPLAZA "TU_USUARIO" con tu nombre de usuario)
git remote add origin https://github.com/TU_USUARIO/PORTAFOLIO_ERY_CURSOS.git

# Cambiar el nombre de la rama a 'main'
git branch -M main

# Subir todos los archivos
git push -u origin main
```

**Nota**: Te pedirá tus credenciales de GitHub. Si no puedes subir, es posible que necesites un Personal Access Token en lugar de tu contraseña. Ve a GitHub Settings → Developer settings → Personal access tokens.

### 3. Activar GitHub Pages

1. En tu repositorio en GitHub, ve a **Settings**
2. En el menú lateral, busca **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Haz clic en **Save**
5. Espera 1-2 minutos

Tu sitio estará disponible en:

```text
https://TU_USUARIO.github.io/PORTAFOLIO_ERY_CURSOS/
```

## 🗂️ CONFIGURAR SUPABASE (OPCIONAL PERO RECOMENDADO)

### Por qué usar Supabase

- Almacenamiento en la nube para archivos subidos
- 1GB gratis de storage
- URLs públicas para compartir archivos

### Pasos

1. **Crea una cuenta** en [Supabase.com](https://supabase.com)

2. **Crea un nuevo proyecto**:
   - Organization: Crea una nueva o usa existente
   - Name: `ERY-CURSOS` o el que prefieras
   - Database Password: Guarda esta contraseña (LA NECESITARÁS)
   - Region: Selecciona el más cercano a ti
   - Haz clic en "Create new project"

3. **Crea el bucket de storage**:
   - En el panel de Supabase, ve a **Storage**
   - Click en **"Create a new bucket"**
   - Name: `course-uploads`
   - **Public bucket**: Marca esta opción ✅
   - Click "Create bucket"

4. **Configura las políticas** (para permitir subir/leer archivos):
   - Ve a **Storage** → Haz clic en el bucket `course-uploads`
   - Click en **"Policies"**
   - Click en **"New Policy"**
   - Usa estas 3 políticas (copia el SQL):

```sql
-- Política 1: Permitir subidas públicas
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'course-uploads');

-- Política 2: Permitir lectura pública
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-uploads');

-- Política 3: Permitir eliminar archivos
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'course-uploads');
```

1. **Obtén tus credenciales**:
   - Ve a **Settings** → **API**
   - Copia estos dos valores:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJhbG...` (clave larga)

2. **Actualiza los archivos HTML**:

   Abre cada archivo HTML (`index.html`, `unidad1.html`, `contact.html`, etc.) y busca estas líneas:

   ```html
   <meta name="supabase-url" content="YOUR_SUPABASE_URL_HERE">
   <meta name="supabase-key" content="YOUR_SUPABASE_ANON_KEY_HERE">
   ```

   Reemplaza con tus valores:

   ```html
   <meta name="supabase-url" content="https://tuproyecto.supabase.co">
   <meta name="supabase-key" content="tu_clave_anon_aqui">
   ```

3. **Sube los cambios a GitHub**:

   ```powershell
   git add .
   git commit -m "Add Supabase credentials"
   git push
   ```

## 📂 ARCHIVOS CREADOS

```text
PORTAFOLIO_ERY_CURSOS/
├── index.html              ✅ Página principal con hero section
├── unidad1.html            ✅ Unidad I completa con 4 semanas
├── contact.html            ✅ Página de contacto con formulario
├── css/
│   ├── styles.css          ✅ Sistema de diseño completo
│   ├── components.css      ✅ Componentes reutilizables
│   └── animations.css      ✅ Animaciones y efectos
├── js/
│   ├── main.js             ✅ JavaScript principal
│   ├── progress.js         ✅ Sistema de tracking de progreso
│   └── fileUpload.js       ✅ Sistema de carga con Supabase
├── README.md               ✅ Documentación completa
├── SUPABASE_CONFIG.md      ✅ Guía de configuración
└── .gitignore              ✅ Configuración de Git
```

## 🎯 TAREAS PENDIENTES (Opcional)

Si quieres completar el proyecto al 100%:

1. **Crear las unidades restantes**:
   - Copia `unidad1.html` y modifica para crear:
     - `unidad2.html`
     - `unidad3.html`
     - `unidad4.html`
   - Cambia los nombres de las semanas y contenido

2. **Crear página de cursos**:
   - `courses.html` con vista general del curso

3. **Agregar logo UPLA**:
   - Crea carpeta `assets/images/`
   - Agrega archivo `upla-logo.png`

4. **Personalizar colores** (si quieres):
   - Edita `css/styles.css`
   - Busca las variables CSS en `:root`
   - Cambia los valores HSL

## 🆘 AYUDA Y TROUBLESHOOTING

### Si no puedes hacer push a GitHub

```powershell
# Verifica que tienes Git instalado
git --version

# Verifica tu configuración
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Si necesitas cambiar la URL remote
git remote set-url origin https://github.com/TU_USUARIO/PORTAFOLIO_ERY_CURSOS.git
```

### Si Supabase no funciona

- Abre la consola del navegador (F12) y revisa errores
- Verifica que las credenciales estén correctas
- Asegúrate que el bucket sea público
- Lee `SUPABASE_CONFIG.md` para más detalles

### Para probar localmente

```powershell
# Con Python
python -m http.server 8000
# Luego abre: http://localhost:8000

# Con Node.js
npx serve
```

## 📞 CONTACTO

Si tienes preguntas o necesitas ayuda:

- Email: <edwramirezy@gmail.com>
- Teléfono: +51 967013078

---

**¡LISTO! Tu portafolio está preparado para GitHub y Supabase** 🚀
