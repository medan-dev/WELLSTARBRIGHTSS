# Wellstar Bright - Finance POS Desktop Client [Offline-First Executable]

This is the **isolated, offline-capable desktop application** for the finance sector of Wellstar Bright School Management System.

---

## 🌟 Key Architecture & Capabilities

1. **100% Portal Separation**:
   * Completely decoupled from the public website, student portal, and teacher portal.
   * Runs natively on the Bursar/Accountant's computer as a cross-platform desktop application on Windows (`.exe`), macOS (`.dmg`/`.app`), and Linux (`.AppImage`/`.deb`).

2. **Works Both Offline & Online**:
   * Uses local client storage and sequential receipt generation (`RCP-YYYY-WS-XXXXX`).
   * Even during zero-connectivity network outages or power cuts, accountants can search students, collect school fees, issue official thermal receipts, and disburse petty cash.

3. **Automatic Bidirectional Central Sync**:
   * Built-in sync daemon polls the school server (`/api/finance/sync`) when network/internet is active.
   * Ingests offline transactions into the central PostgreSQL database and automatically generates balanced double-entry General Ledger journal entries.
   * Downloads fresh student enrollments and fee structures back to the desktop app.

4. **Super Admin Supervision**:
   * The central Super Admin can see every workstation's IP, sync status, and transaction history.
   * Includes one-click **Remote Workstation Lockout** if a laptop is lost or compromised.

---

## 🚀 How to Run the Desktop App in Development

From this directory (`desktop-finance-app/`):

```bash
# 1. Install Electron dependencies (if not already installed)
npm install

# 2. Launch the desktop app
npm start
```

---

## 📦 How to Package into Executables for Windows, macOS, and Linux

All packaged binaries will be output to the `dist/` folder.

### 1. Windows Executables (`.exe`)
Build both the Portable `.exe` and the NSIS Setup Installer:
```bash
npm run build:win
```
- **Portable**: `dist/Wellstar Finance POS.exe` (run directly without installation)
- **Installer**: `dist/Wellstar Finance POS Setup 1.0.0.exe` (installs to Program Files with desktop shortcuts)

### 2. macOS Executables (`.dmg` & `.zip`)
Build the Apple Disk Image (`.dmg`) and compressed application bundle:
```bash
npm run build:mac
```
- **DMG**: `dist/Wellstar Finance POS-1.0.0.dmg` (drag-and-drop to Applications folder)
- **ZIP**: `dist/Wellstar Finance POS-1.0.0-mac.zip`

### 3. Linux Executables (`.AppImage` & `.deb`)
Build the standalone executable AppImage and Debian/Ubuntu `.deb` installer:
```bash
npm run build:linux
```
- **AppImage**: `dist/Wellstar Finance POS-1.0.0.AppImage` (portable single-file executable, run `chmod +x` and double-click on any Linux distribution)
- **Debian/Ubuntu**: `dist/Wellstar Finance POS_1.0.0_amd64.deb` (`sudo dpkg -i ...`)

### 4. Build All Targets at Once
```bash
npm run build:all
```

---

## 🤖 Automated Cross-Platform CI/CD (GitHub Actions)

A dedicated GitHub Actions workflow is provided at `.github/workflows/build-desktop-finance.yml`. When you push to GitHub or trigger the workflow, GitHub's cloud runners on `windows-latest`, `macos-latest`, and `ubuntu-latest` will concurrently compile native executables for all three operating systems and upload them as downloadable release artifacts.
