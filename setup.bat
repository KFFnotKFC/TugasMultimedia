@echo off
title Setup GIF Maker Environment
echo ============================================================
echo                 GIF MAKER SETUP - ELECTRON + PYTHON
echo ============================================================
echo.

REM === Mengecek Python ===
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] Python belum ditemukan. Mengunduh Python 3.13.9...
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.13.9/python-3.13.9-amd64.exe -OutFile python-installer.exe"
    echo [>] Menjalankan installer Python...
    start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    del python-installer.exe
    echo [√] Python 3.13.9 berhasil diinstal.
) else (
    echo [√] Python terdeteksi.
)

REM === Menginstal Pillow ===
echo.
echo >>> Menginstal dependensi Python...
python -m pip install --upgrade pip >nul
python -m pip install pillow
echo [√] Pillow berhasil diinstal.

REM === Mengecek Node.js ===
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js belum ditemukan. Mengunduh Node.js v25.1.0...
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v25.1.0/node-v25.1.0-x64.msi -OutFile node-installer.msi"
    echo [>] Menjalankan installer Node.js...
    start /wait msiexec /i node-installer.msi /quiet /norestart
    del node-installer.msi
    echo [√] Node.js v25.1.0 berhasil diinstal.
) else (
    echo [√] Node.js terdeteksi.
)

REM === Menginstal dependensi Node (Electron, dsb) ===
echo.
echo >>> Menginstal dependensi Node.js (electron, electron-builder)...
if exist "node_modules" (
    echo [=] Dependensi Node.js sudah ada, melewati instalasi.
) else (
    call npm install
)
echo [√] Semua dependensi Node.js siap digunakan.

echo.
echo ============================================================
echo Setup selesai! Jalankan "start.bat" untuk membuka aplikasi.
echo ============================================================
pause
