# Run Full System Test Script for Windows PowerShell
$ProjectRoot = Resolve-Path "$PSScriptRoot\..\.."
$mlDir = Join-Path $ProjectRoot "ml_service"
$venvPython = Join-Path $mlDir ".venv\Scripts\python.exe"

$pythonExe = "python"
if (Test-Path $venvPython) {
    $pythonExe = $venvPython
} elseif (Test-Path "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe") {
    $pythonExe = "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe"
} elseif (Test-Path "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe") {
    $pythonExe = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
}

Write-Host "Starting Python FastAPI ML Service on port 8000 using $pythonExe..." -ForegroundColor Cyan
$mlProcess = Start-Process -FilePath $pythonExe -ArgumentList "-m uvicorn main:app --port 8000 --host 127.0.0.1" -WorkingDirectory $mlDir -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 6

try {
    Write-Host "Probing http://127.0.0.1:8000/health..." -ForegroundColor Cyan
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get -TimeoutSec 5
    Write-Host "ML Service Health Status: $($health.status)" -ForegroundColor Green

    Write-Host "`nRunning End-to-End Express -> ML Integration Test..." -ForegroundColor Cyan
    node "$ProjectRoot\backend\tests\integration.test.js"
} catch {
    Write-Host "Error connecting to ML Service: $_" -ForegroundColor Red
} finally {
    Write-Host "Cleaning up ML Service process..." -ForegroundColor Cyan
    Stop-Process -Id $mlProcess.Id -Force -ErrorAction SilentlyContinue
}
