@echo off
title LAB MANAGEMENT SYSTEM

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -NoProfile -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo.
echo =======================================================
echo    BIENVENIDO AL SISTEMA DE GESTION DE LABORATORIOS
echo =======================================================

REM Ir a la carpeta del proyecto
cd /d "%~dp0"

echo.
echo =======================================================
echo    INICIANDO SERVIDOR LOCAL...
echo =======================================================
echo.

powershell -NoProfile -Command "Start-Service -Name 'com.docker.service'; while (-not (docker info 2>$null)) { Start-Sleep -Seconds 1 }"
start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"


powershell -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/k npm run dev' -WorkingDirectory '%~dp0'"

:waitserver
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    echo SISTEMA: Comprobando disponibilidad del Back-End...
    goto waitserver
)

:waitfront
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    echo SISTEMA: Comprobando disponibilidad del Front-End...
    goto waitfront
)

echo.
echo =======================================================
echo    SERVIDOR LOCAL INICIADO CORRECTAMENTE
echo =======================================================

echo.
echo SISTEMA: REDIRIGIENDO A LA PAGINA DE INICIO...

timeout /t 2 /nobreak >nul

start "" "http://localhost:5173/login"