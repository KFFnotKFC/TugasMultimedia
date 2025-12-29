const { ipcRenderer } = require("electron");
const dropzone = document.getElementById("dropzone");
const result = document.getElementById("result");
const makeGifBtn = document.getElementById("makeGifBtn");
const durationInput = document.getElementById("duration");

// Drag & drop
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

  const files = Array.from(e.dataTransfer.files).filter(f => /\.(png|jpe?g)$/i.test(f.name));
  if (files.length === 0) {
    result.textContent = "❌ Tidak ada file gambar yang valid.";
    return;
  }

  result.textContent = "📤 Mengunggah file...";

  // Ambil buffer file
  const buffers = await Promise.all(
    files.map(f =>
      f.arrayBuffer().then(b => ({ name: f.name, buffer: Buffer.from(b) }))
    )
  );

  // Kirim ke main process untuk disimpan di folder data
  try {
    const msg = await ipcRenderer.invoke("save-files", buffers);
    result.textContent = msg;
  } catch (err) {
    result.textContent = `❌ Error menyimpan file: ${err.message}`;
  }
});

// Tombol buat GIF
makeGifBtn.addEventListener("click", async () => {
  const duration = parseInt(durationInput.value) || 100;
  result.textContent = "⚙️ Membuat GIF...";

  try {
    const msg = await ipcRenderer.invoke("make-gif", duration);
    result.textContent = msg;

    // Tampilkan preview GIF jika berhasil
    if (msg.startsWith("✅")) {
      const gifPath = msg.split(": ")[1];
      const img = document.createElement("img");
      img.src = `file://${gifPath}?${Date.now()}`;
      img.alt = "Preview GIF";
      img.style.display = "block";
      img.style.margin = "20px auto";
      img.style.maxWidth = "400px";
      img.style.borderRadius = "8px";
      img.style.border = "2px solid #ccc";

      result.appendChild(img);
    }
  } catch (err) {
    result.textContent = `❌ Error membuat GIF: ${err.message}`;
  }
});
