# 📋 Logbook Magang

Aplikasi web untuk mencatat kegiatan harian magang secara digital. Mendukung multiple user, CRUD penuh, dan export laporan ke CSV/PDF.

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
- 📤 **Export** — Download laporan ke **CSV** (Excel-friendly) atau **PDF** (A4 Landscape)
- ☁️ **Serverless** — Siap deploy ke Vercel tanpa backend tambahan

---

## 🗂️ Kolom Logbook

| Kolom | Tipe | Keterangan |
|---|---|---|
| Tanggal | Date | Tanggal kegiatan |
| Unit / Divisi | Dropdown | NOC / Lapangan, Maintenance, Support, System/Dev, Admin/Teknis |
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

## 🚀 Cara Menjalankan

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
2. Jalankan file `supabase_setup.sql` di **SQL Editor** Supabase
3. Salin **Project URL** dan **anon key** dari **Settings → API**

### 4. Buat file `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy ke Vercel

1. Push project ini ke GitHub
2. Import repo di [vercel.com/new](https://vercel.com/new)
3. Tambahkan environment variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy** ✅

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── (auth)/login/          # Halaman Login
│   ├── (auth)/signup/         # Halaman Daftar
│   └── (dashboard)/dashboard/ # Dashboard + CRUD
├── components/
│   ├── logbook-form.tsx        # Form dialog (Create/Edit)
│   ├── logbook-table.tsx       # Tabel data + search
│   └── export-buttons.tsx      # Export CSV & PDF
└── lib/supabase/
    ├── client.ts               # Supabase browser client
    ├── server.ts               # Supabase server client
    └── types.ts                # TypeScript types
```

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pribadi maupun akademik.
