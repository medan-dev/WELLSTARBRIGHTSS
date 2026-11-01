const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("financeDesktop", {
  getMachineId: () => ipcRenderer.invoke("get-machine-id"),
  printReceipt: (options) => ipcRenderer.invoke("print-receipt", options),
  platform: process.platform,
});
