@echo off
title Start GIF Maker
echo ============================================================
echo                  MENJALANKAN APLIKASI GIF MAKER
echo ============================================================
echo.

REM Pastikan folder node_modules sudah ada
if not exist "node_modules" (
    echo [!] Dependensi belum diinstal. Jalankan setup.bat terlebih dahulu.
    pause
    exit /b
)

echo >>> Menjalankan aplikasi Electron...
call npx electron .
