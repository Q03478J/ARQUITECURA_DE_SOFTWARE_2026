@echo off
echo ========================================
echo INICIANDO SERVIDOR LOCAL
echo ========================================
echo.
echo El servidor se iniciará en: http://localhost:8000
echo.
echo IMPORTANTE: Deja esta ventana abierta mientras usas el sistema
echo.
echo Para detener el servidor, cierra esta ventana o presiona Ctrl+C
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Intentar con Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Iniciando servidor con Python 3...
    echo.
    echo Abre tu navegador en: http://localhost:8000/login.html
    echo.
    python -m http.server 8000
    goto :end
)

REM Intentar con Python 2
python2 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Iniciando servidor con Python 2...
    echo.
    echo Abre tu navegador en: http://localhost:8000/login.html
    echo.
    python2 -m SimpleHTTPServer 8000
    goto :end
)

REM Intentar con Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python no encontrado. Intentando con Node.js...
    echo.
    echo Instalando 'http-server' globalmente...
    call npm install -g http-server
    echo.
    echo Iniciando servidor con Node.js...
    echo.
    echo Abre tu navegador en: http://localhost:8000/login.html
    echo.
    http-server -p 8000
    goto :end
)

echo.
echo ========================================
echo ERROR: No se encontró Python ni Node.js
echo ========================================
echo.
echo Por favor instala una de las siguientes opciones:
echo.
echo 1. Python 3: https://www.python.org/downloads/
echo 2. Node.js: https://nodejs.org/
echo.
echo Después, ejecuta este archivo nuevamente.
echo.
pause
exit /b 1

:end
