const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

let win;

// Folder utama
const rootDir = process.cwd();
const dataDir = path.join(rootDir, "data");
const outputDir = path.join(rootDir, "output");

// Pastikan folder ada
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

// Simpan file hasil drag & drop ke folder data
ipcMain.handle("save-files", async (event, files) => {
  for (const f of files) {
    const dest = path.join(dataDir, f.name);
    fs.writeFileSync(dest, Buffer.from(f.buffer));
  }
  return `>>> File disimpan ke folder: ${dataDir}`;
});

// Proses pembuatan GIF
ipcMain.handle("make-gif", async (event, duration) => {
  return new Promise((resolve) => {
    const outputPath = path.join(outputDir, "output.gif");
    const scriptPath = path.join(__dirname, "py/make_gif.py");

    console.log("Menjalankan Python script:", scriptPath);

    const python = spawn("python", [scriptPath, dataDir, outputPath, duration]);
    let logs = "";

    python.stdout.on("data", (d) => (logs += d.toString()));
    python.stderr.on("data", (d) => (logs += d.toString()));

    python.on("close", () => {
      // Jika berhasil membuat GIF, hapus semua gambar di folder data
      if (fs.existsSync(outputPath)) {
        const files = fs.readdirSync(dataDir);
        for (const file of files) {
          fs.unlinkSync(path.join(dataDir, file));
        }
        logs += `\n>>> GIF berhasil dibuat: ${outputPath}`;
      } else {
        logs += "\n[X] GIF gagal dibuat. File output tidak ditemukan.";
      }

      resolve(logs);
    });
  });
});
