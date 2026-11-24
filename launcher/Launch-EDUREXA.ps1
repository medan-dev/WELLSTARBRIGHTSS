# ============================================================
# EDUREXA School Management System — PowerShell Silent Launcher
# This script starts the Next.js server in the background
# (no console window) and opens the browser when ready.
# ============================================================

$ProjectDir = Split-Path -Parent $PSScriptRoot
$Port       = 3000
$Url        = "http://localhost:$Port"
$LogFile    = "$PSScriptRoot\server.log"
$PidFile    = "$PSScriptRoot\server.pid"
$MaxWait    = 90   # seconds

# --- Check if already running on port 3000 ---
$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Start-Process $Url
    exit 0
}

# --- Start Next.js silently via a hidden cmd window ---
$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName        = "cmd.exe"
$startInfo.Arguments       = "/c npm run start > `"$LogFile`" 2>&1"
$startInfo.WorkingDirectory = $ProjectDir
$startInfo.WindowStyle     = [System.Diagnostics.ProcessWindowStyle]::Hidden
$startInfo.CreateNoWindow  = $true
$startInfo.UseShellExecute = $false

$proc = [System.Diagnostics.Process]::Start($startInfo)
$proc.Id | Out-File $PidFile -Encoding ascii

Write-Host "EDUREXA server starting (PID $($proc.Id))..."

# --- Wait for server to be ready ---
$ready = $false
for ($i = 0; $i -lt $MaxWait; $i++) {
    Start-Sleep -Seconds 1
    try {
        $resp = Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {}
    Write-Host "  Waiting... ($i/$MaxWait)"
}

# --- Open browser ---
Start-Process $Url
if ($ready) {
    Write-Host "EDUREXA is live at $Url"
} else {
    Write-Host "Server may still be loading — browser opened anyway."
}
