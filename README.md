# Pengeluaran Bulanan

Pencatat pengeluaran bulanan sederhana dalam satu file HTML. Tanpa server, tanpa database, tanpa akun. Bisa langsung dipasang di GitHub Pages secara gratis.

## Fitur

- Catat pengeluaran: tanggal, kategori, keterangan, dan jumlah
- Isi pendapatan bulanan secara manual (tersimpan terpisah untuk tiap bulan)
- Lihat total pengeluaran, sisa uang, dan persentase pendapatan yang sudah terpakai
- Ringkasan pengeluaran per kategori
- Pindah antar bulan dengan pemilih bulan
- Hapus satu pengeluaran, atau hapus semua data pada bulan yang dipilih
- Unduh data bulan aktif sebagai file CSV
- Tampilan menyesuaikan mode terang/gelap perangkat dan nyaman dipakai di HP

## Cara pasang di GitHub Pages

1. Buat repo baru bernama `username.github.io` (ganti `username` dengan username GitHub kamu). Atur visibilitas ke **Public**, karena GitHub Pages gratis hanya untuk repo publik.
2. Upload `index.html` ke repo tersebut.
3. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
4. Tunggu satu sampai dua menit, lalu buka `https://username.github.io`.

Untuk memperbarui, cukup ganti `index.html` di repo dengan versi terbaru lalu commit.

Bisa juga dijalankan lokal: buka `index.html` langsung di browser.

## Mode offline

Halaman ini bisa dibuka tanpa internet. Setelah dibuka **sekali saat online**, file-nya disimpan di browser lewat service worker, dan berikutnya halaman tetap terbuka walau offline. Data juga tersimpan di perangkat, jadi mencatat pengeluaran tetap jalan tanpa koneksi.

Halaman juga bisa dipasang seperti aplikasi:

- **Android (Chrome)**: menu ⋮ → *Install app* / *Tambahkan ke layar utama*
- **iPhone (Safari)**: tombol Bagikan → *Add to Home Screen*

File yang harus ada di repo (semuanya di folder yang sama):

| File | Fungsi |
| --- | --- |
| `index.html` | Halaman utama |
| `sw.js` | Service worker untuk mode offline |
| `manifest.webmanifest` | Info aplikasi untuk fitur pasang ke layar utama |
| `icon-192.png`, `icon-512.png` | Ikon aplikasi |

Kalau kamu mengubah `index.html` dan perubahan belum muncul, naikkan angka versi pada `const CACHE = 'pengeluaran-v1'` di `sw.js` (misalnya jadi `v2`) agar cache lama diganti.

## Cara pakai

1. Pilih bulan di pojok kanan atas.
2. Isi kolom **Pendapatan** dengan pemasukan bulan itu. Nilainya tersimpan otomatis.
3. Isi form pengeluaran lalu klik **Tambah**.
4. Pantau kartu **Pengeluaran** dan **Sisa**. Angka sisa berubah merah kalau pengeluaran melebihi pendapatan.
5. Klik **Unduh CSV** untuk menyimpan salinan data bulan itu.

## Format CSV

Contoh isi file `pengeluaran-2026-11.csv`:

```csv
Tanggal,Kategori,Keterangan,Jumlah
2026-11-02,"Makan","Makan siang",35000
2026-11-05,"Transportasi","Bensin",50000

Pendapatan,,,5000000
Total pengeluaran,,,85000
Sisa,,,4915000
```

Angka ditulis tanpa "Rp" dan tanpa pemisah ribuan sehingga mudah dihitung di Excel atau Google Sheets.

## Penyimpanan data

Data disimpan di **localStorage** browser kamu, dengan dua kunci:

| Kunci | Isi |
| --- | --- |
| `pengeluaran-v1` | Daftar semua pengeluaran |
| `pendapatan-v1` | Pendapatan per bulan |

Yang perlu diketahui:

- Data **tidak dikirim ke mana pun** dan tidak ikut terupload ke GitHub. Yang publik hanya kode halamannya.
- Data hanya ada di browser dan perangkat yang kamu pakai. Membuka situs di HP dan laptop akan menampilkan data yang terpisah.
- Data bisa hilang kalau cache atau data situs dibersihkan, atau kalau memakai mode incognito. Unduh CSV secara berkala sebagai cadangan.

## Kustomisasi

Semua ada di `index.html`:

- **Kategori**: ubah daftar `<option>` pada elemen `<select id="kat">`.
- **Warna**: ubah variabel CSS di bagian `:root` (mode terang) dan `@media (prefers-color-scheme: dark)` (mode gelap).
- **Mata uang**: ubah `currency: 'IDR'` dan `'id-ID'` pada fungsi `rp`.

## Batasan

- Tidak ada sinkronisasi antar perangkat. Kalau dibutuhkan, data bisa dihubungkan ke layanan seperti Google Sheets atau Supabase.
- Pendapatan hanya satu angka per bulan, belum mendukung beberapa sumber pemasukan.
- Pengeluaran belum bisa diedit. Hapus lalu tambahkan ulang.
