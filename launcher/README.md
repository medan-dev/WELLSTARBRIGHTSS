# EDUREXA Launcher

This folder contains **silent launcher scripts** that let you start EDUREXA School Management System **without opening any terminal or console window** — just like a normal desktop application.

---

## Files

| File | Purpose |
|------|---------|
| `Launch-EDUREXA.vbs` | **Main launcher** — double-click to start the server + open browser silently |
| `Stop-EDUREXA.vbs` | Stops the background server |
| `Create-Shortcuts.vbs` | Creates Desktop and Start Menu shortcuts (run once) |
| `Launch-EDUREXA.ps1` | Alternative PowerShell launcher (for IT admins) |
| `server.log` | Auto-created server output log (created on first launch) |
| `server.pid` | Auto-created process sentinel (deleted on stop) |

---

## First-Time Setup

1. Make sure Node.js is installed: [https://nodejs.org](https://nodejs.org)
2. Open a terminal **once** and run: `npm install` inside the SMS folder (only needed once)
3. Double-click **`Create-Shortcuts.vbs`** to create Desktop/Start Menu shortcuts
4. After that, use the **Desktop shortcut** to launch — no terminal ever again

---

## How It Works

- `Launch-EDUREXA.vbs` uses `WScript.Shell` with window style **0 (hidden)** to run `npm run start` with no visible console
- It polls `http://localhost:3000` until the server is ready, then opens your browser automatically
- If the server is already running, it just opens the browser immediately
- The Finance Desktop App (the `.exe`) connects to this running server automatically, so both stay in sync

---

## Finance Desktop App

The separate **Wellstar Finance POS** desktop app (Electron `.exe`) is designed to:
1. Connect to this running web server at `http://localhost:3000/finance` for live data sync
2. Fall back to its own offline mode if the server isn't running

Download the installer from the web portal: `http://localhost:3000/downloads`
