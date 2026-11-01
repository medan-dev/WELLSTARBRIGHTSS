@echo off
title Wellstar Bright - Finance POS Desk [Offline-First]
cd /d "%~dp0"

echo ===================================================
echo   Wellstar Bright Secondary School - Finance POS
echo   Isolated Offline-First Bursar Workstation Client
echo ===================================================
echo.

:: Ensure Central Server is active to guarantee real-time bidirectional syncing
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Starting Central Server in background for real-time synchronization...
    start /min "Wellstar-Central-Server" cmd /c "cd /d "%~dp0\.." && npm run dev"
    timeout /t 3 /nobreak >nul
)

:: Check if Electron is installed
if exist "node_modules\electron" (
    echo Launching native Electron runtime...
    npx electron .
    exit /b
)

:: Standalone Native App Mode (Zero-Dependency Fallback)
echo Launching standalone desktop window...
set "HTML_PATH=%~dp0index.html"

where msedge >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start msedge --start-maximized --app="file:///%HTML_PATH%" --user-data-dir="%LOCALAPPDATA%\WellstarFinanceData"
    exit /b
)

where chrome >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start chrome --start-maximized --app="file:///%HTML_PATH%" --user-data-dir="%LOCALAPPDATA%\WellstarFinanceData"
    exit /b
)

start "" "%HTML_PATH%"
