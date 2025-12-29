const fs = require("fs");
const path = require("path");
const GIFEncoder = require(path.join(__dirname, "gifencoder"));
const PNG = require("png-js");
const jpeg = require("jpeg-js");

process.on("message", async ({ duration, dataDir, outputDir }) => {
  try {
    const files = fs.readdirSync(dataDir).filter(f => /\.(png|jpe?g)$/i.test(f)).sort();
    if (files.length === 0) {
      process.send("❌ Tidak ada frame di folder data.");
      return;
    }

    // Load first image
    const firstImg = await loadImagePixels(path.join(dataDir, files[0]));
    const width = firstImg.width;
    const height = firstImg.height;

    const encoder = new GIFEncoder(width, height);
    const outputPath = path.join(outputDir, "output.gif");
    const stream = fs.createWriteStream(outputPath);
    encoder.createReadStream().pipe(stream);

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(Number(duration));
    encoder.setQuality(10);

    for (const f of files) {
      const img = await loadImagePixels(path.join(dataDir, f));
      if (img.width !== width || img.height !== height) {
        process.send(`❌ Semua gambar harus sama ukuran: ${f}`);
        return;
      }
      encoder.addFrame(img.pixels);
    }

    encoder.finish();
    await new Promise(r => stream.on("finish", r));

    // Hapus frame
    for (const f of files) {
      fs.unlinkSync(path.join(dataDir, f));
    }

    process.send(`✅ GIF berhasil dibuat: ${outputPath}`);
  } catch (err) {
    process.send(`❌ Error membuat GIF: ${err.message}`);
  }
});

// Fungsi load image
async function loadImagePixels(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png") {
    return new Promise((resolve) => {
      const img = PNG.decode(filePath);
      img.decode((pixels) => resolve({ pixels, width: img.width, height: img.height }));
    });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    const jpegData = fs.readFileSync(filePath);
    const img = jpeg.decode(jpegData, { useTArray: true });
    return { pixels: img.data, width: img.width, height: img.height };
  } else {
    throw new Error("Format gambar tidak didukung");
  }
}
