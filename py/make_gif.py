from PIL import Image
import os, sys

def make_gif(image_folder, output_name="output/output.gif", duration=100):
    images = []
    for file_name in sorted(os.listdir(image_folder)):
        if file_name.endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(image_folder, file_name)
            images.append(Image.open(path))
    if not images:
        print("Tidak ada gambar ditemukan di folder:", image_folder)
        return
    images[0].save(output_name, save_all=True, append_images=images[1:], duration=duration, loop=0)
    print(f"GIF berhasil dibuat: {output_name}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Gunakan: python make_gif.py <folder> <output> <duration>")
        sys.exit(1)
    make_gif(sys.argv[1], sys.argv[2], int(sys.argv[3]))
