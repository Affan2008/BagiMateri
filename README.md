# BagiMateri

Platform belajar mahasiswa yang ringan untuk membuat, berbagi, dan membaca materi kuliah. Dirancang untuk mahasiswa yang mengandalkan koneksi internet lambat atau terbatas.


Submission untuk Hacktiv8 x IBM SkillsBuild oleh

```
Nama: Affan Haidar Maulana
NRP: 5027261054
Fakultas/Departemen: FTEIC/Teknologi Informasi
Sesi kelas: 25 Oktober (offline)
```

## Fitur Utama

- Cari dan baca materi yang diterbitkan berdasarkan kategori, pencarian, dan pengurutan
- Editor dengan heading, daftar, blok kode, gambar, dan hyperlink
- KaTeX untuk persamaan LaTeX (`$...$` inline, `$$...$$` blok)
- Login dengan username + kata sandi (TODO: login dan verifikasi via email)
- Dark Mode
- Layout resposif di desktop, tablet, dan smartphone
- Upload gambar untuk digunakan pada materi buatanmu (JPEG, PNG, WebP, maks. 2 MB)
- Halaman di-render di server, editor dimuat secara lazy, bundle JS minimal

## Tech Stack

| Type | Teknologi |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma ORM |
| Auth | Auth.js (next-auth v5) Credentials provider |
| Editor | Tiptap |
| Matematika | KaTeX |
| Ikon | Lucide React |

---

## Running

### 1. Kebutuhan

- **Node.js** 18+
- **npm** 9+

### 2. Clone dan install paket

```bash
git clone https://github.com/Affan2008/BagiMateri.git
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
NEXTAUTH_SECRET=insert-secret-key-here

# Path database SQLite (dari folder utama projek)
DATABASE_URL="file:./prisma/prisma/dev.db"

NEXTAUTH_URL=http://localhost:3000
```

> Nilai `NEXTAUTH_SECRET` bisa dibuat dengan:
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

Isi data demo saat ini:
- **6 kategori**: Calculus I, Physics Mechanics, Accounting Basics, Data Structures, Linear Algebra, Discreet Mathematics
- **2 pengguna demo**: `demo1` / `demo1234` dan `demo2` / `demo1234`
- **4 materi yang diterbitkan** dengan konten realistis termasuk persamaan LaTeX dan cuplikan kode

(note: saat ini isi data demo berada dalam Bahasa Inggris)

### 6. Jalankan server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.


---

## Kredensial Demo

Login dengan salah satu akun berikut:

| Username | Kata Sandi |
|---|---|
| `demo1` | `demo1234` |
| `demo2` | `demo1234` |

---


## Menulis Persamaan Matematika

Editor mendukung LaTeX math via KaTeX:

- **Math inline**: apit dengan tanda dolar tunggal — `$x^2 + y^2 = r^2$`
- **Math blok**: apit dengan tanda dolar ganda — `$$\int_0^\infty e^{-x^2}\,dx$$`

---

## Upload Gambar

- Format yang diterima: JPEG, PNG, WebP
- Ukuran file maksimum: 2 MB
- Gambar disimpan di `public/uploads/` dengan nama file UUID
- Direktori `public/uploads/` dikecualikan dari version control

---

## Catatan

Proyek saat ini dibuat untuk **dijalankan secara lokal**.

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

