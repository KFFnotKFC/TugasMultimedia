# gif-enc
Project kecil untuk bikin encoder GIF super sederhana (dan jujur aja, kurang efisien 😄) yang ditulis sekitar 64 baris Python.

Project ini dibuat buat belajar dalaman format GIF, mulai dari cara kerja palet warna, kuantisasi, sampai dithering. Cocok buat yang penasaran gimana GIF itu sebenarnya disimpan.

Untuk kuantisasi warna, project ini pakai `MiniBatchKMeans` dari scikit-learn. Sedangkan dithering-nya pakai algoritma Floyd–Steinberg biar hasilnya kelihatan lebih halus walaupun jumlah warnanya terbatas.

Data gambar GIF sendiri disimpan pakai format LZW. Di sini LZW-nya cuma dipakai sebagai format, bukan buat kompresi beneran, jadi output-nya masih besar tapi tetap valid sebagai GIF.

## Example:

```python
import ppm
import gif

rgb_pixels = ppm.loadppm(open("tests/cat256.ppm", "rb"))
indices, palette = gif.palettise(rgb_pixels)

gif.save(open("tests/cat.gif", "wb"), indices, palette)
```

Gambar input (aslinya PPM, dikonversi ke PNG biar bisa dilihat di browser):

![Example input](https://github.com/DavidBuchanan314/gif-enc/blob/master/tests/cat256.png)

Output:

![Example output](https://github.com/DavidBuchanan314/gif-enc/blob/master/tests/cat.gif)

## Steganography

Project ini juga iseng-iseng dipakai buat eksperimen steganografi. Caranya cukup unik: dua gambar digabung jadi satu gambar dengan 6 channel warna (RGB + RGB), lalu diperlakukan seolah-olah itu satu gambar biasa.

Karena masih pakai algoritma clustering yang sama, hasilnya adalah satu GIF yang sebenarnya menyimpan dua gambar. Yang menarik, cuma satu gambar yang kelihatan dalam satu waktu. Kalau urutan palet warnanya dibalik, gambar satunya langsung muncul.

```python
import ppm
import gif

rgb_pixels_a = ppm.loadppm(open("tests/cat256.ppm", "rb"))
rgb_pixels_b = ppm.loadppm(open("tests/parrot256.ppm", "rb"))

# merge the two 3-channel images into a single 6-channel image
rgbrgb_pixels = [[a+b for a, b in zip(a_row, b_row)] for a_row, b_row in zip(rgb_pixels_a ,rgb_pixels_b)]

indices, palette = gif.palettise(rgbrgb_pixels, n_entries=128)

# un-merge the 6-channel pallete into a 3-channel palette
palette_a = [rgbrgb[:3] for rgbrgb in palette]
palette_a += list(reversed([rgbrgb[3:] for rgbrgb in palette]))

gif.save(open("tests/a.gif", "wb"), indices, palette_a)
gif.save(open("tests/b.gif", "wb"), indices, list(reversed(palette_a))) # exactly the same image data, only reversed palette order
```

GIF pertama bisa dianggap sebagai gambar “cover”:

![Example input](https://github.com/DavidBuchanan314/gif-enc/blob/master/tests/a.gif)

Sedangkan GIF kedua sebenarnya file yang sama persis, tapi dengan urutan palet dibalik:

![Example input](https://github.com/DavidBuchanan314/gif-enc/blob/master/tests/b.gif)

Kalau kedua file ini dibuka pakai hex editor, bakal kelihatan kalau perbedaannya cuma ada di bagian palet warna saja. Lokasinya sekitar offset 13 byte dari awal file, dengan ukuran total 768 byte. Di luar itu, isi kedua file benar-benar identik.

# Referensi

DavidBuchanan314/gif-enc

robert-ancell/pygif

qalle2/pygif (arsip)