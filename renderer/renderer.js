const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

// require gifencoder lokal (folder root/gifencoder)
const GIFEncoder = require(path.join(__dirname, "..", "gifencoder"));

const dropzone = document.getElementById("dropzone");
const result = document.getElementById("result");
const makeGifBtn = document.getElementById("makeGifBtn");
const durationInput = document.getElementById("duration");

// Folder data & output
const dataDir = path.join(__dirname, "..", "data");
const outputDir = path.join(__dirname, "..", "output");

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", async (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const files = Array.from(e.dataTransfer.files);
  if (files.length === 0) return;

  result.textContent = "📤 Mengunggah file...";
  const buffers = await Promise.all(
    files.map((f) =>
      f.arrayBuffer().then((b) => ({ name: f.name, buffer: Buffer.from(b) }))
    )
  );

  // simpan file ke folder data
  for (const f of buffers) {
    fs.writeFileSync(path.join(dataDir, f.name), f.buffer);
  }

  result.textContent = `>>> File disimpan ke folder: ${dataDir}`;
});

makeGifBtn.addEventListener("click", async () => {
  const duration = parseInt(durationInput.value) || 100;
  result.textContent = "⚙️ Membuat GIF...";

  // baca semua file gambar dari folder data
  const files = fs.readdirSync(dataDir).filter(f => /\.(png|jpe?g)$/i.test(f));

  if (files.length === 0) {
    result.textContent = "[X] Tidak ada gambar di folder data.";
    return;
  }

  // tentukan ukuran GIF berdasarkan gambar pertama
  const sizeOf = require("image-size");
  const firstImgPath = path.join(dataDir, files[0]);
  const dimensions = sizeOf(firstImgPath);

  const encoder = new GIFEncoder(dimensions.width, dimensions.height);
  const outputPath = path.join(outputDir, "output.gif");
  const stream = fs.createWriteStream(outputPath);

  encoder.createReadStream().pipe(stream);
  encoder.start();
  encoder.setRepeat(0);   // loop terus
  encoder.setDelay(duration);
  encoder.setQuality(10);

  const { createCanvas, loadImage } = require("canvas");
  const canvas = createCanvas(dimensions.width, dimensions.height);
  const ctx = canvas.getContext("2d");

  for (const file of files) {
    const img = await loadImage(path.join(dataDir, file));
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    encoder.addFrame(ctx);
  }

  encoder.finish();

  // hapus file di folder data setelah selesai
  for (const file of files) {
    fs.unlinkSync(path.join(dataDir, file));
  }

  result.textContent = `✅ GIF berhasil dibuat: ${outputPath}`;

  // tampilkan preview
  const gifUrl = `file://${outputPath}?${Date.now()}`;
  const img = document.createElement("img");
  img.src = gifUrl;
  img.alt = "Preview GIF";
  img.style.display = "block";
  img.style.margin = "20px auto";
  img.style.maxWidth = "400px";
  img.style.borderRadius = "8px";
  img.style.border = "2px solid #ccc";

  result.appendChild(img);
});
