const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const GIFEncoder = require(path.join(__dirname, "gifencoder"));
const PNG = require("png-js"); // npm install png-js

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

// Proses pembuatan GIF dengan gifencoder
ipcMain.handle("make-gif", async (event, duration = 100) => {
  try {
    const files = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
      .sort();

    if (files.length === 0) return "❌ Tidak ada frame di folder data.";

    // Baca ukuran frame pertama
    const firstFrame = PNG.decode(path.join(dataDir, files[0]));
    const size = await new Promise((resolve) =>
      firstFrame.decode((pixels) => {
        resolve({ width: firstFrame.width, height: firstFrame.height });
      })
    );

    const encoder = new GIFEncoder(size.width, size.height);
    const outputPath = path.join(outputDir, "output.gif");
    encoder.createReadStream().pipe(fs.createWriteStream(outputPath));

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(Number(duration));
    encoder.setQuality(10);

    // Tambahkan frame satu per satu
    for (const f of files) {
      const png = PNG.decode(path.join(dataDir, f));
      await new Promise((resolve) =>
        png.decode((pixels) => {
          encoder.addFrame(pixels);
          resolve();
        })
      );
    }

    encoder.finish();

    // Hapus semua frame di folder data
    for (const f of files) {
      fs.unlinkSync(path.join(dataDir, f));
    }

    return `✅ GIF berhasil dibuat: ${outputPath}`;
  } catch (err) {
    return `❌ Error membuat GIF: ${err.message}`;
  }
});
