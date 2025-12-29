const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

let win;

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "data");
const outputDir = path.join(rootDir, "output");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  win.loadFile("renderer/index.html");
}

app.whenReady().then(createWindow);

// Save files
ipcMain.handle("save-files", async (event, files) => {
  for (const f of files) {
    const dest = path.join(dataDir, f.name);
    fs.writeFileSync(dest, Buffer.from(f.buffer));
  }
  return `>>> File disimpan ke folder: ${dataDir}`;
});

// Buat GIF menggunakan child process
ipcMain.handle("make-gif", async (event, duration = 100) => {
  return new Promise((resolve, reject) => {
    const child = fork(path.join(__dirname, "core", "gif-worker.js"));

    child.send({ duration, dataDir, outputDir });

    child.on("message", (msg) => {
      resolve(msg);
      child.kill();
    });

    child.on("error", (err) => {
      reject(`❌ Error worker: ${err.message}`);
    });
  });
});
