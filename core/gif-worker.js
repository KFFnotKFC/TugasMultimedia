const fs = require("fs");
const path = require("path");
const GIFEncoder = require("../gifencoder");
const UPNG = require("./UPNG"); // pastikan path sesuai lokasi UPNG.js

// ----- Steganografi helper -----
function hideMessageInFrame(framePixels, message) {
  const msgBytes = Buffer.from(message, "utf8");
  let bitIndex = 0;
  for (let i = 0; i < framePixels.length; i++) {
    if (bitIndex >= msgBytes.length * 8) break;
    const byteIndex = Math.floor(bitIndex / 8);
    const bitInByte = 7 - (bitIndex % 8);
    const bit = (msgBytes[byteIndex] >> bitInByte) & 1;
    framePixels[i] = (framePixels[i] & 0xFE) | bit;
    bitIndex++;
  }
  return framePixels;
}

function extractMessageFromFrame(framePixels, length) {
  const msgBytes = Buffer.alloc(length);
  let bitIndex = 0;
  for (let i = 0; i < framePixels.length && bitIndex < length * 8; i++) {
    const bit = framePixels[i] & 1;
    const byteIndex = Math.floor(bitIndex / 8);
    msgBytes[byteIndex] = (msgBytes[byteIndex] << 1) | bit;
    bitIndex++;
    if (bitIndex % 8 === 0 && byteIndex < length) {
      // finalize byte
      msgBytes[byteIndex] = msgBytes[byteIndex];
    }
  }
  return msgBytes.toString("utf8");
}

// ----- Load PNG via UPNG.js -----
async function loadPNGtoRGBA(filePath) {
  const buffer = fs.readFileSync(filePath);
  const img = UPNG.decode(buffer);
  const rgba = UPNG.toRGBA8(img)[0]; // ambil frame pertama
  return { pixels: rgba, width: img.width, height: img.height };
}

// ----- Main worker -----
process.on("message", async (data) => {
  const { duration, dataDir, outputDir, secretMessage, action, gifFiles } = data;

  try {
    if (action === "make-gif") {
      // Ambil semua PNG
      const files = fs.readdirSync(dataDir).filter(f => f.toLowerCase().endsWith(".png")).sort();
      if (!files.length) {
        process.send("❌ Tidak ada PNG untuk membuat GIF.");
        return;
      }

      let firstImg = await loadPNGtoRGBA(path.join(dataDir, files[0]));
      if (secretMessage) firstImg.pixels = hideMessageInFrame(firstImg.pixels, secretMessage);

      const encoder = new GIFEncoder(firstImg.width, firstImg.height);
      const outputPath = path.join(outputDir, "output.gif");
      encoder.createReadStream().pipe(fs.createWriteStream(outputPath));

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(duration);
      encoder.setQuality(10);

      encoder.addFrame(firstImg.pixels);

      for (let i = 1; i < files.length; i++) {
        const img = await loadPNGtoRGBA(path.join(dataDir, files[i]));
        encoder.addFrame(img.pixels);
      }

      encoder.finish();
      await new Promise(r => setTimeout(r, 100)); // tunggu stream selesai

      for (const f of files) fs.unlinkSync(path.join(dataDir, f));

      process.send(`✅ GIF berhasil dibuat: ${outputPath}`);

    } else if (action === "extract-message") {
      if (!gifFiles || !gifFiles.length) {
        process.send("❌ Tidak ada GIF untuk diekstrak.");
        return;
      }

      // Ambil GIF pertama
      const gifPath = path.join(dataDir, gifFiles[0]);
      const buffer = fs.readFileSync(gifPath);
      const img = UPNG.decode(buffer);
      const rgba = UPNG.toRGBA8(img)[0];

      // Panjang pesan dari TXT
      const msgLength = secretMessage.length;
      const message = extractMessageFromFrame(rgba, msgLength);

      process.send(`📝 Pesan dalam GIF: ${message}`);
    }

  } catch (err) {
    process.send(`❌ Error di worker: ${err.message}`);
  }
});
