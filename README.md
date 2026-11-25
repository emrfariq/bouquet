# 💜 buket untuk Bibiy

sebuket bunga ungu yang digambar dari huruf, mekar satu per satu, berputar pelan, lalu mengetik pesan-pesan kecil di bawahnya. dibuat Emir untuk Bibiy.

semuanya cuma HTML, CSS, dan JavaScript biasa: tanpa install, tanpa build.

## isi buketnya

- 8 mawar (violet, lavender, plum, ungu tua, lilac)
- 2 bunga kerucut ungu, 5 bunga sakura lilac, 3 lili (lilac dan putih)
- 5 daisy (putih dan aster ungu), 4 tulip (ungu, ungu tua, lilac, putih)
- 3 hydrangea ungu kebiruan, ranting lavender, daun eucalyptus, dan baby's breath yang berkelip
- kertas pembungkus ungu dengan motif hati, tissue lilac, pita ungu tua dan label kecil yang bergoyang
- hati dan kelopak yang berjatuhan, bintang, dan kunang-kunang yang mengitari buket

## tombol

| tombol | fungsi |
| --- | --- |
| `spasi` | jeda / lanjutkan putaran |
| `+` / `-` | putar lebih cepat / lebih lambat |
| `r` | putar ke arah sebaliknya |
| `n`, klik, atau ketuk layar | lanjut ke pesan berikutnya |

## buka di komputer sendiri

buka `index.html` langsung di browser, atau jalankan server kecil di folder ini:

```
python -m http.server 5173
```

lalu buka http://localhost:5173.

## upload ke Vercel

**lewat GitHub (paling gampang):**

1. push repo ini ke GitHub
2. di [vercel.com](https://vercel.com) pilih **Add New → Project**, lalu import repo ini
3. *Framework Preset*: **Other**. kosongkan *Build Command* dan *Output Directory*
4. klik **Deploy**

**lewat terminal:**

```
npm i -g vercel
vercel --prod
```

## mengganti tulisan

buka `bouquet.js`. di bagian paling atas ada:

```js
const TO_NAME = "Bibiy";
const FROM_NAME = "Emir";
const SIGNATURE = "dirangkai pelan-pelan, khusus buat kamu — " + FROM_NAME + " ♥";
const MESSAGES = [
  "...",
];
```

ganti kata-kata di dalam tanda kutip. jangan hapus tanda kutip dan komanya. `MESSAGES` diketik bergantian dari atas ke bawah.

warna bunga juga ada di `bouquet.js` (bagian `warna`), dalam bentuk kode 256 warna terminal dari gelap ke terang. campuran bunganya diatur di daftar `wish` di dalam `buildScene()`.

## versi terminal

`bouqet.py` adalah versi aslinya yang jalan di terminal, dengan warna dan tulisan yang sama:

```
python bouqet.py
```

tekan `q` untuk keluar.

## kredit

dibuat ulang dari [bouquet](https://github.com/snappytappyy/probable-waffle) karya **Red Ivan Clay**, yang membuat versi terminal aslinya untuk orang spesialnya. versi web, warna ungu, dan tulisannya diubah untuk Bibiy.

© 2026 Red Ivan Clay
