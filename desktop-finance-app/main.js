const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const os = require("os");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "Wellstar Bright — Financial Workstation & POS [Connected Client]",
    icon: path.join(__dirname, "logo.png"),
    backgroundColor: "#090d16",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Target the live standalone Web Finance portal first
  const targetServerUrl =
    process.env.FINANCE_SERVER_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000/finance";

  // Attempt to load the live web portal so updates are instantaneous and appearance is identical
  mainWindow
    .loadURL(targetServerUrl)
    .then(() => {
      console.log(`[Finance POS Desktop] Connected to live web standalone: ${targetServerUrl}`);
    })
    .catch((err) => {
      console.warn(
        `[Finance POS Desktop] Could not connect to central server (${targetServerUrl}). Falling back to embedded offline POS:`,
        err.message
      );
      // Fallback to local offline-first interface
      mainWindow.loadFile(path.join(__dirname, "index.html"));
    });

  // Handle navigation errors dynamically (e.g. server restart)
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL.includes("localhost") || validatedURL.includes("http")) {
      console.warn(`[Finance POS Desktop] Connection lost to ${validatedURL}, falling back to offline POS...`);
      mainWindow.loadFile(path.join(__dirname, "index.html"));
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Hardware Machine ID detection
ipcMain.handle("get-machine-id", () => {
  const hostname = os.hostname();
  const cpus = os.cpus();
  const model = cpus.length > 0 ? cpus[0].model.replace(/[^a-zA-Z0-9]/g, "") : "GENERIC";
  return `WS-${hostname.toUpperCase().slice(0, 10)}-${model.slice(0, 6)}`;
});

// Native Print Receipt Handler
ipcMain.handle("print-receipt", (event, options) => {
  if (!mainWindow) return false;
  mainWindow.webContents.print(
    {
      silent: false,
      printBackground: true,
      deviceName: options?.deviceName || "",
    },
    (success, errorType) => {
      if (!success) console.log("Printing failed/canceled:", errorType);
    }
  );
  return true;
});
