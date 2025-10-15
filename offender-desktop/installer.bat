@echo off
title Offender Desktop Setup
color 0A

echo.
echo ===================================================
echo   🚀 OFFENDER-DESKTOP PROJECT INSTALLER (Windows)
echo ===================================================
echo.

:: 1️⃣ Node шалгах
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node 20 or higher.
    pause
    exit /b
)

:: 2️⃣ pnpm шалгах, байхгүй бол суулгах
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚙️ Installing pnpm globally...
    npm install -g pnpm
)

:: 3️⃣ Dependencies шалгах
if not exist node_modules (
    echo 📦 Installing dependencies...
    pnpm install
) else (
    echo ✅ Dependencies already installed.
)

:: 4️⃣ Development server ажиллуулах
echo.
echo 🚀 Starting development environment...
pnpm dev

pause
