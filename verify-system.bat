@echo off
REM ===================================
REM SCRIPT DE VERIFICACION DEL SISTEMA
REM ERY CURSOS - Verificacion Post-Deployment
REM ===================================

echo.
echo ========================================
echo  VERIFICACION DEL SISTEMA ERY CURSOS
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "supabase_complete_schema.sql" (
    echo [ERROR] No se encuentra supabase_complete_schema.sql
    echo Por favor ejecuta este script desde el directorio del proyecto
    pause
    exit /b 1
)

echo [OK] Directorio del proyecto detectado
echo.

REM Verificar archivos nuevos creados
echo Verificando archivos JavaScript nuevos...

set missing=0

if exist "js\admin-users.js" (
    echo [OK] js\admin-users.js
) else (
    echo [ERROR] js\admin-users.js NO ENCONTRADO
    set missing=1
)

if exist "js\admin-assignments.js" (
    echo [OK] js\admin-assignments.js
) else (
    echo [ERROR] js\admin-assignments.js NO ENCONTRADO
    set missing=1
)

if exist "js\grading.js" (
    echo [OK] js\grading.js
) else (
    echo [ERROR] js\grading.js NO ENCONTRADO
    set missing=1
)

if exist "js\notifications.js" (
    echo [OK] js\notifications.js
) else (
    echo [ERROR] js\notifications.js NO ENCONTRADO
    set missing=1
)

if exist "js\dashboard-admin.js" (
    echo [OK] js\dashboard-admin.js
) else (
    echo [ERROR] js\dashboard-admin.js NO ENCONTRADO
    set missing=1
)

echo.
echo Verificando dashboards HTML...

if exist "dashboard-evaluator.html" (
    echo [OK] dashboard-evaluator.html
) else (
    echo [ERROR] dashboard-evaluator.html NO ENCONTRADO
    set missing=1
)

if exist "dashboard-assistant.html" (
    echo [OK] dashboard-assistant.html
) else (
    echo [ERROR] dashboard-assistant.html NO ENCONTRADO
    set missing=1
)

echo.
echo Verificando documentacion...

if exist "ADMIN_GUIDE.md" (
    echo [OK] ADMIN_GUIDE.md
) else (
    echo [ERROR] ADMIN_GUIDE.md NO ENCONTRADO
    set missing=1
)

if exist "DEPLOYMENT_GUIDE.md" (
    echo [OK] DEPLOYMENT_GUIDE.md
) else (
    echo [ERROR] DEPLOYMENT_GUIDE.md NO ENCONTRADO
    set missing=1
)

echo.
echo ========================================

if %missing%==0 (
    echo  TODOS LOS ARCHIVOS ESTAN PRESENTES
    echo ========================================
    echo.
    echo [OK] Verificacion completada exitosamente
    echo.
    echo SIGUIENTE PASO:
    echo 1. Abre DEPLOYMENT_GUIDE.md
    echo 2. Sigue las instrucciones paso a paso
    echo 3. Ejecuta supabase_complete_schema.sql en Supabase
    echo.
) else (
    echo  FALTAN ARCHIVOS
    echo ========================================
    echo.
    echo [ERROR] Algunos archivos no se encontraron
    echo Por favor verifica que todos los archivos esten sincronizados
    echo.
)

REM Verificar estado de Git
echo Verificando estado de Git...
git status >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo Estado de Git:
    git status --short
    echo.
    echo Si hay archivos sin sincronizar, ejecuta:
    echo   git add .
    echo   git commit -m "Deployment ready"
    echo   git push origin main
) else (
    echo [WARNING] Git no esta disponible o no es un repositorio Git
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
