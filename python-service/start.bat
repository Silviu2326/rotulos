@echo off
echo Iniciando Scene3D Python Service en puerto 8000...
echo.

:: Instalar dependencias si no existen
python -c "import cv2" 2>nul || (
    echo Instalando dependencias...
    pip install -r requirements.txt
)

echo Servicio listo. Ctrl+C para detener.
echo.
python main.py
