# Sistem Penilaian Risiko Kecanduan Game Mobile Legends

Sistem Fuzzy + Sistem Pakar untuk assessment kecanduan game Mobile Legends.

## Deskripsi

Sistem ini menggunakan metode **Fuzzy Logic (Mamdani)** dan **Sistem Pakar (Rule-Based)** untuk menilai tingkat risiko kecanduan game Mobile Legends berdasarkan jawaban kuesioner Ya/Tidak.

## Struktur Project

```
├── index.html     # Halaman utama aplikasi
├── styles.css     # Styling CSS modern
├── script.js      # Fuzzy Engine + Expert System
└── README.md      # Dokumentasi
```

## Variabel Fuzzy Input

| Variabel | Deskripsi |
|----------|-----------|
| **Durasi** | Lama waktu bermain per hari |
| **Frekuensi** | Seberapa sering bermain dalam seminggu |
| **Intensitas** | Seberapa fokus saat bermain |
| **Dampak** | Pengaruh terhadap aktivitas sehari-hari |

## Metode yang Digunakan

### 1. Fuzzy Logic (Mamdani)
- Fuzzification: Konversi input ke nilai keanggotaan fuzzy
- Inference: Evaluasi 30 rules fuzzy
- Defuzzification: Centroid method untuk mendapatkan skor crisp

### 2. Sistem Pakar (Rule-Based)
- IF-THEN rules untuk diagnosis
- Rekomendasi berdasarkan level risiko

## Level Risiko

| Level | Warna | Skor |
|-------|-------|------|
| Rendah | Hijau | 0-40 |
| Sedang | Kuning | 40-60 |
| Tinggi | Orange | 60-80 |
| Sangat Tinggi | Merah | 80-100 |

## Cara Menjalankan

Buka file `index.html` di browser:
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

## Deploy ke Vercel

1. Buat repository baru di GitHub
2. Upload semua file ke repository
3. Buka [vercel.com](https://vercel.com)
4. Import repository
5. Deploy otomatis

## Referensi

- WHO Gaming Disorder Classification
- Mamdani Fuzzy Inference System
- Expert System Rule-Based Approach