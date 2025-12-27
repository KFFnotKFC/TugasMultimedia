const { ipcRenderer } = require("electron");

const dropzone = document.getElementById("dropzone");
const result = document.getElementById("result");
const makeGifBtn = document.getElementById("makeGifBtn");
const durationInput = document.getElementById("duration");
const path = require("path");

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

  const res = await ipcRenderer.invoke("save-files", buffers);
  result.textContent = res;
});

makeGifBtn.addEventListener("click", async () => {
  const duration = durationInput.value || 100;
  result.textContent = "⚙️ Membuat GIF...";
  const log = await ipcRenderer.invoke("make-gif", duration);

  // Tampilkan log
  result.textContent = log;

  // ✅ ambil path absolut dari hasil output.gif
  const gifFullPath = path.join(process.cwd(), "output", "output.gif");

  // ✅ ubah jadi URL file agar bisa di-load oleh <img>
  const gifUrl = `file://${gifFullPath}?${Date.now()}`;

  // tampilkan preview
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
