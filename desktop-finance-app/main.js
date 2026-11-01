const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const os = require("os");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 700,
    title: "Wellstar Bright - Finance & POS Desk [Offline-First]",
    icon: path.join(__dirname, "logo.png"),
    backgroundColor: "#090d16",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

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
