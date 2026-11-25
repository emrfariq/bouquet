# Buket untuk Bibiy — versi web

## Tujuan
Buket ASCII 3D berputar (aslinya `bouqet.py`, jalan di terminal) dijadikan hadiah dari **Emir** untuk **Bibiy**:
dibuka di browser, di-hosting manual di **Vercel**, bernuansa **ungu** (warna favorit Bibiy, warna Kuromi), dengan tulisan romantis.

## Goals
- Halaman web statis yang terlihat dan bergerak seperti versi terminal: buket mekar satu per satu, berputar, hati/kelopak berjatuhan, pesan diketik di bawah.
- Campuran dan warna bunga didominasi ungu.
- Nama, pesan, dan signature untuk Bibiy dari Emir.
- Bisa di-deploy ke Vercel tanpa build step.

## Non-goals
- Bentuk bunga baru (hanya mengganti campuran dan warna).
- Backend, database, atau form apa pun.
- Gambar atau karakter Kuromi (hanya palet warnanya).

## Anti-goals
- Halaman patah-patah/lag di HP biasa.
- Kehilangan nuansa "buket dari huruf" (tidak diganti jadi grafis 3D biasa).

## Pendekatan
1. **Port ke JavaScript, render teks ke `<pre>` (dipilih).** Logika `bouqet.py` ditulis ulang 1:1 ke JS; tiap frame jadi teks berwarna di halaman. Ringan, tanpa library, tampilannya tetap sama dengan aslinya.
2. **Pyodide (Python di browser).** Kode Python dipakai apa adanya, tapi download ~10 MB, loading lama, dan input terminal tetap harus diakali. Ditolak.
3. **Gambar ulang dengan Canvas/WebGL.** Lebih "mulus", tapi pekerjaan jauh lebih besar dan kehilangan ciri khas ASCII-nya. Ditolak.

Emir menyerahkan cara pembuatannya; pendekatan 1 adalah pilihan Claude.

## Desain
- **File:** `index.html`, `style.css`, `bouquet.js` di root repo. Vercel menyajikannya sebagai situs statis (tanpa `package.json`, tanpa build).
- **Render:** port fungsi `build_scene`, `dynamic_points`, `raster_flower`, `render`, partikel, dan fase pesan. Hasil per frame: teks dengan rentang warna; karakter berurutan yang warnanya sama digabung dalam satu `<span>` supaya cepat. Kode warna 256 terminal dikonversi ke hex.
- **Ukuran:** jumlah kolom/baris dihitung dari ukuran jendela dan font monospace; ikut berubah saat jendela di-resize atau HP diputar. Latar gelap.
- **Kontrol:** keyboard sama seperti aslinya (`space`, `+`/`-`, `r`, `n`); `q` tidak dipakai. Di HP: ketuk = pesan berikutnya. Petunjuk kontrol kecil di bawah.
- **Campuran bunga (warna ungu dominan, tetap ada aksen putih/lilac agar tidak datar):**
  - 8 mawar: lavender, ungu tua, violet, plum, lilac pucat (ganti merah/peach/coral)
  - 3 lili: putih dan lilac
  - 4 tulip: ungu, ungu tua, lilac, putih
  - 5 daisy: 3 putih, 2 aster ungu
  - 3 hydrangea: ungu-biru
  - bunga matahari dan sakura pink diganti dengan bunga berwarna ungu/lilac (jumlah total tetap 27)
  - kertas pembungkus lavender, tissue lilac, pita ungu tua, hati dan kelopak jatuh ungu-pink, warna teks pesan ungu
- **Teks:**
  - `TO_NAME`: Bibiy
  - `FROM_NAME`: Emir
  - Pesan (bahasa Indonesia, bergantian):
    1. "Bibiy, kalau setiap kali aku mikirin kamu tumbuh satu bunga, mungkin dunia udah jadi taman ungu sekarang."
    2. "Buket ini nggak akan pernah layu, sama kayak sayangku ke kamu."
    3. "Aku pilih ungu karena itu warna favoritmu. Dan aku pilih kamu karena kamu favoritku."
    4. "Terima kasih udah jadi bagian paling indah dari hari-hariku."
  - Signature: "dirangkai pelan-pelan, khusus buat kamu — Emir ♥"
- **Versi Python:** `bouqet.py` tetap ada, nama/pesan/warnanya disamakan dengan versi web.
- **README:** ditulis ulang untuk versi web (cara buka lokal dan deploy ke Vercel), tetap mencantumkan kredit pembuat asli (Red Ivan Clay).

## Diserahkan ke pembuat
Kode warna 256 persis untuk tiap palet ungu, ukuran font, dan penyesuaian performa (misalnya FPS lebih rendah di layar kecil).
