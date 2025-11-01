@echo off
title Setup GIF Maker Environment
echo ============================================================
echo                 GIF MAKER SETUP - ELECTRON + PYTHON
echo ============================================================
echo.

REM === Mengecek Python ===
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] Python belum terinstal.
    echo     Silakan install Python 3 dari https://python.org/downloads
    pause
    exit /b
)
echo [√] Python terdeteksi.

REM === Menginstal Pillow ===
echo.
echo >>> Menginstal dependensi Python...
python -m pip install --upgrade pip >nul
python -m pip install pillow
echo [√] Pillow berhasil diinstal.

REM === Mengecek Node.js ===
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js belum terinstal.
    echo     Silakan install Node.js dari https://nodejs.org/en/download
    pause
    exit /b
)
echo [√] Node.js terdeteksi.

REM === Menginstal dependensi Node (Electron, dsb) ===
echo.
echo >>> Menginstal dependensi Node.js (electron, electron-builder)...
call npm install
echo [√] Semua dependensi Node berhasil diinstal.

echo.
echo ============================================================
echo Setup selesai! Jalankan "start.bat" untuk membuka aplikasi.
echo ============================================================
pause
