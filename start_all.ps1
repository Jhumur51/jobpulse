# ==============================================================================
# JOBPULSE - Master PowerShell Launcher and DevOps Pre-flight Health Checker
# ==============================================================================
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\start_all.ps1
#
# Optional parameter:
#   powershell -ExecutionPolicy Bypass -File .\start_all.ps1 -SeparateWindows
# ==============================================================================

param (
    [switch]$SeparateWindows = $false
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "   JOBPULSE - Complete System Pre-flight Check and Service Launcher             " -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) { $ProjectRoot = (Get-Location).Path }

# ------------------------------------------------------------------------------
# STEP 1: Verify Prerequisites Software
# ------------------------------------------------------------------------------
Write-Host "[1/5] Checking Installed Software..." -ForegroundColor Yellow

# 1.1 Node.js Check
try {
    $nodeVersion = node -v 2>$null
    if ($nodeVersion) {
        Write-Host "  [OK] Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Node.js is NOT found on PATH! Please install Node.js v18+ from https://nodejs.org" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  [ERROR] Node.js execution error: $_" -ForegroundColor Red
    exit 1
}

# 1.2 Python Check
$PythonBinary = $null
$venvPython = Join-Path $ProjectRoot "ml_service\.venv\Scripts\python.exe"
$localPython313 = "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe"
$localPython312 = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"

if (Test-Path $venvPython) {
    $PythonBinary = $venvPython
    $pyVer = & $PythonBinary --version 2>&1
    Write-Host "  [OK] Python (Virtual Environment): $pyVer at $venvPython" -ForegroundColor Green
} elseif (Test-Path $localPython313) {
    $PythonBinary = $localPython313
    $pyVer = & $PythonBinary --version 2>&1
    Write-Host "  [OK] Python 3.13: $pyVer at $localPython313" -ForegroundColor Green
} elseif (Test-Path $localPython312) {
    $PythonBinary = $localPython312
    $pyVer = & $PythonBinary --version 2>&1
    Write-Host "  [OK] Python 3.12: $pyVer at $localPython312" -ForegroundColor Green
} else {
    try {
        $pyVer = python --version 2>&1
        if ($pyVer -like "*Python*") {
            $PythonBinary = "python"
            Write-Host "  [OK] Python (System PATH): $pyVer" -ForegroundColor Green
        }
    } catch {}
}

if (-not $PythonBinary) {
    Write-Host "  [ERROR] Python is NOT found! Please install Python 3.10+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# 1.3 Git Check
try {
    $gitVer = git --version 2>$null
    if ($gitVer) {
        Write-Host "  [OK] Git: $gitVer" -ForegroundColor Green
    } else {
        Write-Host "  [INFO] Git is not detected on PATH (optional for local running)" -ForegroundColor Gray
    }
} catch {}

# ------------------------------------------------------------------------------
# STEP 2: Check Environment Files (.env)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/5] Checking Environment Files..." -ForegroundColor Yellow

$backendEnv = Join-Path $ProjectRoot "backend\.env"
$backendEnvExample = Join-Path $ProjectRoot "backend\.env.example"
$frontendEnv = Join-Path $ProjectRoot "frontend\.env"
$frontendEnvExample = Join-Path $ProjectRoot "frontend\.env.example"

if (-not (Test-Path $backendEnv)) {
    if (Test-Path $backendEnvExample) {
        Copy-Item $backendEnvExample $backendEnv
        Write-Host "  [NOTICE] backend\.env was missing. Automatically created from backend\.env.example" -ForegroundColor Yellow
    } else {
        Write-Host "  [ERROR] backend\.env is missing!" -ForegroundColor Red
    }
} else {
    Write-Host "  [OK] backend\.env configured" -ForegroundColor Green
}

if (-not (Test-Path $frontendEnv)) {
    if (Test-Path $frontendEnvExample) {
        Copy-Item $frontendEnvExample $frontendEnv
        Write-Host "  [NOTICE] frontend\.env was missing. Automatically created from frontend\.env.example" -ForegroundColor Yellow
    } else {
        Write-Host "  [ERROR] frontend\.env is missing!" -ForegroundColor Red
    }
} else {
    Write-Host "  [OK] frontend\.env configured" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# STEP 3: Check PostgreSQL Availability
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/5] Checking Database Connectivity..." -ForegroundColor Yellow

function Test-PortAvailability {
    param ([string]$TargetHost, [int]$TargetPort)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connectResult = $tcpClient.BeginConnect($TargetHost, $TargetPort, $null, $null)
        $hasConnected = $connectResult.AsyncWaitHandle.WaitOne(1000, $false)
        if ($hasConnected) {
            $tcpClient.EndConnect($connectResult)
            $tcpClient.Close()
            return $true
        } else {
            $tcpClient.Close()
            return $false
        }
    } catch {
        return $false
    }
}

$pgOnline = Test-PortAvailability -TargetHost "127.0.0.1" -TargetPort 5432
if ($pgOnline) {
    Write-Host "  [OK] PostgreSQL is active and listening on port 5432" -ForegroundColor Green
} else {
    Write-Host "  [INFO] PostgreSQL not detected on port 5432." -ForegroundColor Cyan
    Write-Host "         JobPulse backend will seamlessly use its built-in fallback data store." -ForegroundColor Gray
}

# ------------------------------------------------------------------------------
# STEP 4: Check Target Port Collisions (8000, 5000, 5173)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/5] Checking Port Allocations..." -ForegroundColor Yellow

$p8000 = Test-PortAvailability -TargetHost "127.0.0.1" -TargetPort 8000
$p5000 = Test-PortAvailability -TargetHost "127.0.0.1" -TargetPort 5000
$p5173 = Test-PortAvailability -TargetHost "127.0.0.1" -TargetPort 5173

if ($p8000) { Write-Host "  [WARN] Port 8000 is currently in use (Existing ML Service?)" -ForegroundColor Yellow }
else        { Write-Host "  [OK] Port 8000 is available (ML Service Target)" -ForegroundColor Green }

if ($p5000) { Write-Host "  [WARN] Port 5000 is currently in use (Existing Backend?)" -ForegroundColor Yellow }
else        { Write-Host "  [OK] Port 5000 is available (Express REST API Target)" -ForegroundColor Green }

if ($p5173) { Write-Host "  [WARN] Port 5173 is currently in use (Existing Frontend?)" -ForegroundColor Yellow }
else        { Write-Host "  [OK] Port 5173 is available (Vite Frontend Target)" -ForegroundColor Green }

# ------------------------------------------------------------------------------
# STEP 5: Launch Services
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/5] Service Endpoints Reference:" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "  Python ML Service  : http://127.0.0.1:8000 (Swagger: http://127.0.0.1:8000/docs)" -ForegroundColor Magenta
Write-Host "  Express REST API   : http://localhost:5000 (Health: http://localhost:5000/health)" -ForegroundColor Cyan
Write-Host "  React Frontend     : http://localhost:5173" -ForegroundColor Green
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor Cyan
Write-Host ""

if ($SeparateWindows) {
    Write-Host "Launching services in 3 dedicated terminal windows..." -ForegroundColor Cyan
    
    # 1. ML Service Window
    $mlCmd = "cd '$ProjectRoot\ml_service'; & '$PythonBinary' -m uvicorn main:app --port 8000 --host 127.0.0.1"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== JOBPULSE PYTHON ML SERVICE ===' -ForegroundColor Magenta; $mlCmd"
    
    # 2. Backend Window
    $backendCmd = "cd '$ProjectRoot\backend'; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== JOBPULSE EXPRESS REST BACKEND ===' -ForegroundColor Cyan; $backendCmd"

    # 3. Frontend Window
    $frontendCmd = "cd '$ProjectRoot\frontend'; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== JOBPULSE REACT FRONTEND ===' -ForegroundColor Green; $frontendCmd"
    
    Write-Host "[SUCCESS] All 3 windows opened successfully!" -ForegroundColor Green
} else {
    Write-Host "Starting unified multi-process orchestrator (Press Ctrl+C to stop all)..." -ForegroundColor Cyan
    Write-Host ""
    node start.js
}
