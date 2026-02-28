-- ============================================================
-- Logbook Magang — Supabase SQL Setup
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Buat tabel logbook_kegiatan
CREATE TABLE public.logbook_kegiatan (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tanggal        date NOT NULL,
  unit_divisi    text NOT NULL CHECK (
    unit_divisi IN (
      'NOC / Lapangan',
      'Maintenance',
      'Support',
      'System/Dev',
      'Admin/Teknis'
    )
  ),
  deskripsi      text NOT NULL,
  kendala_solusi text,
  tools          text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.logbook_kegiatan ENABLE ROW LEVEL SECURITY;

-- 3. Policy: setiap user hanya bisa LIHAT data miliknya
CREATE POLICY "Users can view own entries"
  ON public.logbook_kegiatan
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: setiap user hanya bisa TAMBAH data untuk dirinya sendiri
CREATE POLICY "Users can insert own entries"
  ON public.logbook_kegiatan
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: setiap user hanya bisa EDIT data miliknya
CREATE POLICY "Users can update own entries"
  ON public.logbook_kegiatan
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Policy: setiap user hanya bisa HAPUS data miliknya
CREATE POLICY "Users can delete own entries"
  ON public.logbook_kegiatan
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Index supaya query cepat (filter by user + sort by tanggal)
CREATE INDEX idx_logbook_user_tanggal
  ON public.logbook_kegiatan(user_id, tanggal DESC);
