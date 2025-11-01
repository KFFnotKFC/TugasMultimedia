from PIL import Image
import os

# Membuat GIF sederhana dari kumpulan gambar dalam folder
# Menggunakan library Pillow (PIL)
# os digunakan untuk navigasi file system

def make_gif(image_folder, output_name="output.gif", duration=100):
    images = []
    for file_name in sorted(os.listdir(image_folder)):
        if file_name.endswith(('.png', '.jpg', '.jpeg')):
            file_path = os.path.join(image_folder, file_name)
            img = Image.open(file_path)
            images.append(img)

# Mengecek integritas gambar
    if not images:
        print("❌ Tidak ada gambar ditemukan di folder:", image_folder)
        return

    first_image = images[0]
    first_image.save(
        output_name,
        save_all=True,
        append_images=images[1:],
        duration=duration,
        loop=0
    )

    print(f"✅ GIF berhasil dibuat: {output_name}")

# ===== PROGRAM UTAMA =====
if __name__ == "__main__":
    folder = input("📁 Masukkan nama folder berisi gambar: ")
    dur = int(input("⏱️ Durasi tiap frame (ms, contoh 100): ") or "100")
    out = input("💾 Nama file output (contoh animasi.gif): ") or "output.gif"
    make_gif(folder, out, dur)
