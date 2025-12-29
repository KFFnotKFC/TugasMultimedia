const { ipcRenderer } = require("electron");
const dropzone = document.getElementById("dropzone");
const result = document.getElementById("result");
const makeGifBtn = document.getElementById("makeGifBtn");
const durationInput = document.getElementById("duration");

let secretMessage = "";
let pngFiles = [];
let gifFiles = [];

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

  secretMessage = "";
  pngFiles = [];
  gifFiles = [];

  const files = Array.from(e.dataTransfer.files);

  if (!files.length) return;

  result.textContent = "📤 Mengunggah file...";

  const buffers = [];

  for (const f of files) {
    const buffer = Buffer.from(await f.arrayBuffer());
    buffers.push({ name: f.name, buffer });

    if (f.name.toLowerCase().endsWith(".txt")) {
      secretMessage = buffer.toString("utf8");
    } else if (f.name.toLowerCase().endsWith(".png")) {
      pngFiles.push(f.name);
    } else if (f.name.toLowerCase().endsWith(".gif")) {
      gifFiles.push(f.name);
    }
  }

  try {
    const msg = await ipcRenderer.invoke("save-files", buffers);
    result.textContent = msg + (secretMessage ? `\n📝 Pesan ditemukan: "${secretMessage}"` : "");
  } catch (err) {
    result.textContent = `❌ Error menyimpan file: ${err.message}`;
  }
});

// Tombol tunggal
makeGifBtn.addEventListener("click", async () => {
  if (pngFiles.length && secretMessage) {
    // PNG + TXT → buat stego GIF
    const duration = parseInt(durationInput.value) || 100;
    result.textContent = "⚙️ Membuat stego GIF...";

    try {
      const msg = await ipcRenderer.invoke("make-gif", { duration, secretMessage });
      result.textContent = msg;

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

  } else if (gifFiles.length && secretMessage) {
    // GIF + TXT → extract pesan dari GIF
    result.textContent = "🔍 Mengecek pesan di GIF...";

    try {
      const msg = await ipcRenderer.invoke("extract-message", { secretMessageFile: secretMessage, gifFiles });
      result.textContent = `📝 Pesan dalam GIF: ${msg}`;
    } catch (err) {
      result.textContent = `❌ Error membaca pesan: ${err.message}`;
    }

  } else if (pngFiles.length) {
    // PNG saja → tampilkan pesan default
    result.textContent = secretMessage ? `📝 Pesan: ${secretMessage}` : "ℹ️ PNG ditemukan, tapi tidak ada pesan.";
  } else {
    result.textContent = "❌ Tidak ada file yang valid (PNG atau GIF).";
  }
});
