# 📋 Logbook Magang

Aplikasi web untuk mencatat kegiatan harian magang secara digital. Mendukung multiple user, CRUD penuh, manajemen divisi dinamis, dark mode, dan export laporan ke CSV/PDF.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Fitur

- 🔐 **Autentikasi** — Login & Daftar via email/password (Supabase Auth)
- 👥 **Multi-user** — Data setiap user terisolasi sempurna via Row Level Security
- 📊 **Dashboard** — Tabel data dengan search & pagination
- ✏️ **CRUD** — Tambah, edit, dan hapus entri kegiatan
- 🏷️ **Divisi Dinamis** — Kelola unit/divisi sendiri; tambah & hapus sesuai kebutuhan
- 🌙 **Dark Mode** — Toggle tema terang/gelap
- 📤 **Export** — Download laporan ke **CSV** (Excel-friendly) atau **PDF** (A4 Landscape)
- ☁️ **Serverless** — Siap deploy ke Vercel tanpa backend tambahan

---

## 🗂️ Kolom Logbook

| Kolom | Tipe | Keterangan |
|---|---|---|
| Tanggal | Date | Tanggal kegiatan |
| Unit / Divisi | Dropdown | Pilihan default + divisi custom yang kamu buat sendiri |
| Deskripsi | Text | Detail teknis kegiatan |
| Kendala & Solusi | Text | Opsional |
| Tools | Text | Software/hardware yang digunakan |

---

## 🛠️ Tech Stack

- **Frontend & Backend** — [Next.js 16](https://nextjs.org/) (App Router + Server Actions)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth** — [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Hosting** — [Vercel](https://vercel.com/)

---

## 🚀 Cara Menjalankan Lokal

### 1. Clone repository

```bash
git clone https://github.com/username/logbook-magang.git
cd logbook-magang
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → klik **New Query**
3. Copy-paste seluruh isi file [`supabase_setup.sql`](./supabase_setup.sql) → klik **Run**

   > File ini membuat semua tabel dan konfigurasi database yang dibutuhkan sekaligus.

4. Salin **Project URL** dan **anon key** dari **Settings → API**

### 4. Buat file `.env.local`

Buat file `.env.local` di root project (lihat contoh di `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — daftar akun baru, langsung bisa digunakan! 🎉

---

## ☁️ Deploy ke Vercel

1. Push project ini ke GitHub
2. Import repo di [vercel.com/new](https://vercel.com/new)
3. Tambahkan environment variable di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy** ✅

---

## 📁 Struktur Project

```
logbook-magang/
├── supabase_setup.sql              # SQL setup database (jalankan sekali di Supabase)
├── .env.local.example              # Contoh file environment variable
└── src/
    ├── app/
    │   ├── (auth)/login/           # Halaman Login
    │   ├── (auth)/signup/          # Halaman Daftar
    │   └── (dashboard)/dashboard/  # Dashboard + CRUD + Server Actions
    ├── components/
    │   ├── logbook-form.tsx         # Form dialog (Create/Edit)
    │   ├── logbook-table.tsx        # Tabel data + search
    │   ├── division-selector.tsx    # Dropdown divisi dinamis
    │   ├── export-buttons.tsx       # Export CSV & PDF
    │   ├── theme-toggle.tsx         # Toggle dark/light mode
    │   └── theme-provider.tsx       # Provider tema
    └── lib/supabase/
        ├── client.ts                # Supabase browser client
        ├── server.ts                # Supabase server client
        └── types.ts                 # TypeScript types & default divisions
```

---

## 🗄️ Struktur Database

Semua tabel di-setup otomatis lewat `supabase_setup.sql`:

| Tabel | Fungsi |
|---|---|
| `logbook_kegiatan` | Menyimpan seluruh entri kegiatan magang |
| `user_divisions` | Menyimpan divisi/unit custom yang dibuat user |
| `user_hidden_defaults` | Menyimpan divisi default yang disembunyikan user |

Semua tabel dilindungi **Row Level Security (RLS)** — setiap user hanya bisa mengakses datanya sendiri.

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pribadi maupun akademik.
