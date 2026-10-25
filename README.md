# BagiMateri

Platform belajar mahasiswa yang ringan untuk membuat, berbagi, dan membaca materi kuliah. Dirancang untuk mahasiswa yang mengandalkan koneksi internet lambat atau terbatas.

## Fitur Utama

- 📚 **Perpustakaan** — jelajahi materi yang diterbitkan berdasarkan kategori, pencarian, dan pengurutan
- ✏️ **Editor teks kaya** — editor Tiptap dengan heading, daftar, blok kode, gambar, dan tautan
- 🔢 **Render matematika** — KaTeX untuk persamaan LaTeX (`$...$` inline, `$$...$$` blok)
- 🔐 **Autentikasi** — login dengan username + kata sandi, tanpa email
- 🌙 **Mode gelap** — toggle tema terang/gelap/sistem yang persisten
- 📱 **Responsif** — bisa digunakan di desktop, tablet, dan smartphone
- 🖼️ **Unggah gambar** — penyimpanan lokal (JPEG, PNG, WebP, maks. 2 MB)
- 🚀 **Hemat kuota** — halaman di-render di server, editor dimuat secara lazy, bundle JS minimal

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma ORM |
| Auth | Auth.js (next-auth v5) Credentials provider |
| Editor | Tiptap |
| Matematika | KaTeX |
| Ikon | Lucide React |

---

## Memulai dengan Cepat

### 1. Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** versi 9 atau lebih baru

### 2. Clone dan install dependensi

```bash
git clone <url-repositori-kamu>
cd BagiMateri
npm install
```

### 3. Konfigurasi environment

Salin file contoh environment dan edit isinya:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Buat secret yang kuat: openssl rand -base64 32
NEXTAUTH_SECRET=kunci-rahasia-kamu-di-sini

# Path database SQLite (relatif terhadap root proyek)
DATABASE_URL="file:./prisma/dev.db"

NEXTAUTH_URL=http://localhost:3000
```

> **Penting:** `NEXTAUTH_SECRET` wajib diisi. Buat nilainya dengan:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

### 4. Inisialisasi database

```bash
# Buat Prisma client dan terapkan migrasi
npx prisma migrate deploy

# Atau untuk setup pengembangan baru:
npx prisma migrate dev --name init
```

### 5. Isi data demo

```bash
npm run db:seed
```

Perintah ini membuat:
- **6 kategori**: Kalkulus I, Mekanika Fisika, Akuntansi Dasar, Struktur Data, Aljabar Linear, Matematika Diskret
- **2 pengguna demo**: `demo1` / `demo1234` dan `demo2` / `demo1234`
- **4 materi yang diterbitkan** dengan konten realistis termasuk persamaan LaTeX dan cuplikan kode

### 6. Jalankan server pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu.

---

## Setup Satu Langkah (alternatif)

```bash
cp .env.example .env
# Edit .env untuk mengisi NEXTAUTH_SECRET
npm run setup
npm run dev
```

---

## Daftar Skrip

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan server pengembangan |
| `npm run build` | Build untuk produksi |
| `npm start` | Jalankan server produksi |
| `npm run db:generate` | Regenerasi Prisma client |
| `npm run db:migrate` | Jalankan migrasi database (dev) |
| `npm run db:seed` | Isi data demo |
| `npm run db:studio` | Buka Prisma Studio (browser database) |
| `npm run setup` | Setup lengkap: generate + migrate + seed |

---

## Kredensial Demo

Setelah seeding, login dengan salah satu akun berikut:

| Username | Kata Sandi |
|---|---|
| `demo1` | `demo1234` |
| `demo2` | `demo1234` |

---

## Struktur Proyek

```
├── app/
│   ├── layout.tsx              # Layout utama dengan Navbar dan ThemeProvider
│   ├── page.tsx                # Halaman beranda
│   ├── library/page.tsx        # Perpustakaan dengan pencarian, filter, paginasi
│   ├── materials/[id]/
│   │   ├── page.tsx            # Halaman baca materi dengan KaTeX
│   │   └── edit/page.tsx       # Edit materi yang sudah ada
│   ├── create/page.tsx         # Buat materi baru
│   ├── my-materials/page.tsx   # Dasbor materi pengguna
│   ├── login/page.tsx          # Halaman login
│   ├── register/page.tsx       # Halaman registrasi
│   └── api/
│       ├── auth/[...nextauth]/ # Handler Auth.js
│       ├── auth/register/      # Registrasi pengguna
│       ├── materials/          # CRUD materi
│       ├── categories/         # Daftar kategori
│       └── upload/             # Unggah gambar
├── components/
│   ├── Navbar.tsx              # Navigasi dengan toggle tema
│   ├── ThemeToggle.tsx         # Switcher terang/gelap/sistem
│   ├── ThemeProvider.tsx       # Wrapper next-themes
│   ├── SessionWrapper.tsx      # SessionProvider next-auth
│   ├── MaterialCard.tsx        # Kartu daftar materi
│   ├── FilterBar.tsx           # Bar pencarian/filter/pengurutan
│   ├── TiptapEditor.tsx        # Editor teks kaya
│   ├── KatexRenderer.tsx       # Render HTML + matematika KaTeX
│   ├── EditorForm.tsx          # Wrapper form buat/edit
│   └── Pagination.tsx          # Navigasi halaman
├── lib/
│   ├── prisma.ts               # Singleton Prisma client
│   └── sanitize.ts             # Sanitasi HTML di sisi server
├── prisma/
│   ├── schema.prisma           # Skema database
│   ├── seed.ts                 # Skrip seed data demo
│   └── tsconfig.seed.json      # Konfigurasi TypeScript untuk seed
├── public/
│   └── uploads/                # Gambar yang diunggah pengguna (di-gitignore)
├── types/
│   └── next-auth.d.ts          # Augmentasi tipe sesi
├── auth.ts                     # Konfigurasi Auth.js
├── middleware.ts               # Middleware proteksi rute
└── README.md
```

---

## Menulis Persamaan Matematika

Editor mendukung LaTeX math via KaTeX:

- **Math inline**: apit dengan tanda dolar tunggal — `$x^2 + y^2 = r^2$`
- **Math blok**: apit dengan tanda dolar ganda — `$$\int_0^\infty e^{-x^2}\,dx$$`

---

## Unggah Gambar

- Format yang diterima: JPEG, PNG, WebP
- Ukuran file maksimum: 2 MB
- Gambar disimpan di `public/uploads/` dengan nama file UUID
- Direktori `public/uploads/` dikecualikan dari version control

---

## Catatan Deployment

Proyek ini dirancang untuk **pengembangan lokal**. Untuk deployment produksi:

1. Ganti SQLite dengan PostgreSQL atau MySQL (perbarui provider di `prisma/schema.prisma`)
2. Gunakan solusi penyimpanan persisten untuk unggahan gambar (misalnya bucket S3-compatible)
3. Tetapkan `NEXTAUTH_SECRET` yang kuat dan batasi `NEXTAUTH_URL` ke domain kamu
4. Jalankan `npm run build` lalu `npm start`

---

## Keterbatasan yang Diketahui

- **SQLite** tidak direkomendasikan untuk beban tulis-bersamaan di produksi; untuk produksi, migrasi ke PostgreSQL
- **Penyimpanan gambar lokal** — file yang diunggah disajikan dari `public/uploads/`. Ini berfungsi untuk pengembangan lokal, tetapi tidak direplikasi antar deployment terdistribusi
- **Tidak ada pemulihan email** — reset kata sandi memerlukan akses database langsung (ini disengaja — tidak ada ketergantungan email)
- Renderer KaTeX memproses HTML di sisi klien; dokumen yang sangat besar mungkin mengalami kilasan singkat sebelum matematika di-render
