@echo off
title JOBPULSE — Unified Launcher
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0start_all.ps1"
pause
