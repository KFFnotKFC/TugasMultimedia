# Aplikasi Pembuat GIF Berbasis Electron dan Python

## Informasi Proyek
**Judul Proposal:**  
Perancangan Aplikasi Pembuat GIF Berbasis Willow untuk Konten Visual Interaktif  

**Mata Kuliah:** Sistem Multimedia  
**Dosen Pengampu:** Siti Zahrotul Fajriyah, S.Kom., M.Kom.  
**Kelompok 3 – S1IT-KJ-24-03**  
- Khansa Farah Fitriani (103062400113)  
- Aurellia Fira Artanti (103062430009)  
- Daniswara Rafi Pandora (103062400031)  

**Telkom University — 2025**

---

## Deskripsi Proyek
Aplikasi **GIF Maker** merupakan perangkat lunak desktop yang dirancang untuk memudahkan pengguna dalam membuat animasi **GIF** dari kumpulan gambar dengan cara yang sederhana dan cepat.  
Aplikasi ini dibangun menggunakan kombinasi **Electron (JavaScript)** untuk tampilan antarmuka dan **Python (Pillow)** untuk proses pembuatan GIF.

Pengguna dapat dengan mudah menyeret dan melepaskan (drag & drop) gambar ke dalam aplikasi, menentukan durasi setiap frame dalam satuan milidetik, lalu menghasilkan satu file GIF yang langsung disimpan secara otomatis.  
Setelah GIF selesai dibuat, aplikasi juga akan membersihkan folder tempat penyimpanan gambar sementara agar tetap rapi dan efisien.

Aplikasi ini diharapkan dapat membantu pelajar, kreator konten, maupun pengguna umum dalam membuat GIF untuk keperluan komunikasi visual, presentasi, atau hiburan dengan cara yang praktis tanpa memerlukan software profesional.

---

## Fitur Utama
- Antarmuka **drag & drop** yang sederhana dan mudah dipahami.  
- Pengaturan **durasi antar frame** untuk mengatur kecepatan animasi.  
- Hasil GIF otomatis tersimpan di folder **output**.  
- Folder **data** akan otomatis dibersihkan setelah GIF berhasil dibuat.  
- Menampilkan **preview GIF** langsung di dalam aplikasi.  
- Dapat dibuild menjadi file **.exe** agar mudah dijalankan di Windows.

---

## Cara Instalasi dan Menjalankan Aplikasi
Sebelum menggunakan aplikasi, pastikan komputer terhubung dengan internet dan jalankan semua proses sebagai **Administrator** agar instalasi berjalan lancar.

### Langkah 1 — Instalasi Otomatis
Klik dua kali pada file **`setup.bat`**.  
File ini akan secara otomatis melakukan pengecekan dan instalasi komponen berikut:

1. **Python 3.13.9**  
   Jika belum terinstal, aplikasi akan mengunduh dan memasangnya secara otomatis dari situs resmi Python.  
2. **Node.js v25.1.0**  
   Jika belum terinstal, aplikasi juga akan mengunduh dan memasangnya otomatis.  
3. **Dependensi tambahan**  
   Script akan menginstal library Python seperti *Pillow* serta modul Node.js yang dibutuhkan untuk menjalankan Electron.

Setelah proses selesai, sistem siap digunakan.

---

### Langkah 2 — Menjalankan Aplikasi
Untuk membuka aplikasi, cukup jalankan file **`start.bat`**.  
Dalam beberapa detik, jendela utama akan muncul dan menampilkan antarmuka aplikasi GIF Maker.

---

## Cara Menggunakan Aplikasi
1. **Buka aplikasi** melalui `start.bat`.  
2. **Seret dan lepaskan gambar** ke area utama aplikasi.  
3. Atur **durasi frame** sesuai kebutuhan (misalnya 100 milidetik).  
4. Tekan tombol **“Buat GIF”** untuk memulai proses.  
5. Tunggu beberapa saat hingga proses selesai.  
6. Hasil animasi akan tersimpan otomatis di folder `output` dengan nama `output.gif`.  
7. Folder `data` yang berisi gambar sementara akan dibersihkan secara otomatis.  
8. GIF hasil jadi juga akan langsung ditampilkan di dalam aplikasi sebagai **preview**.

Dengan langkah-langkah sederhana ini, pengguna dapat menghasilkan animasi GIF dengan cepat dan efisien tanpa proses rumit.

---

## Membuat File Installer (.exe)
Aplikasi ini juga dapat diubah menjadi installer Windows agar lebih mudah dibagikan.  
Cukup jalankan perintah berikut di terminal atau buat melalui **`build.bat`**:


Proses ini akan menghasilkan file `.exe` di folder `dist`, yang dapat dijalankan di komputer lain tanpa perlu menginstal Node.js atau Python secara terpisah.

---

## Tujuan Pengembangan
Pengembangan aplikasi ini bertujuan untuk:
1. Menyediakan cara sederhana dalam membuat animasi GIF dari kumpulan gambar.  
2. Memberikan pengalaman pengguna yang cepat dan efisien melalui antarmuka yang ramah dan ringan.  
3. Mengedukasi pengguna mengenai proses dasar pembentukan GIF dalam konteks multimedia.  
4. Menjadi proyek pembelajaran yang mengintegrasikan teknologi **Electron**, **Node.js**, dan **Python**.

---

## Latar Belakang
GIF (Graphics Interchange Format) merupakan format visual yang populer karena mampu menampilkan animasi pendek dengan ukuran file yang kecil.  
Dalam dunia komunikasi digital modern, GIF digunakan untuk mengekspresikan emosi, ide, atau reaksi dengan cara yang menarik dan ekspresif.  

Namun, banyak aplikasi pembuat GIF yang memiliki antarmuka rumit atau tidak efisien.  
Oleh karena itu, proyek ini dibuat untuk menghadirkan aplikasi ringan, intuitif, dan cocok bagi siapa pun yang ingin membuat GIF dengan cepat dan mudah.

---

## Batasan Aplikasi
- Input hanya mendukung format gambar `.png`, `.jpg`, dan `.jpeg`.  
- Output terbatas pada satu file GIF (`output.gif`) per proses.  
- Belum mendukung input video langsung.  
- Ditujukan untuk sistem operasi Windows.  

---

## Tim Pengembang
| Nama | NIM | Peran |
|------|------|--------|
| Khansa Farah Fitriani | 103062400113 | UI/UX dan Dokumentasi |
| Aurellia Fira Artanti | 103062430009 | Front-End dan Integrasi Electron |
| Daniswara Rafi Pandora | 103062400031 | Backend Python dan Logika GIF Maker |

---

## Lisensi
Proyek ini dikembangkan untuk tujuan **edukatif dan akademik** pada mata kuliah *Sistem Multimedia* di **Telkom University**.  
Aplikasi ini dapat digunakan untuk keperluan pembelajaran, penelitian, atau pengembangan non-komersial.

---

## Kontak
Untuk saran atau pertanyaan lebih lanjut, silakan hubungi:
- Email: khansa.farah@example.com / aurellia.fira@example.com  
- Universitas: Telkom University, Fakultas Informatika, 2025
