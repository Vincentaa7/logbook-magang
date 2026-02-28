-- ============================================================
-- Migrasi: Dynamic Divisions
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Hapus CHECK constraint lama pada unit_divisi
--    (supaya bisa menerima nilai divisi custom selain yang hardcoded)
ALTER TABLE public.logbook_kegiatan
  DROP CONSTRAINT IF EXISTS logbook_kegiatan_unit_divisi_check;

-- 2. Buat tabel user_divisions
CREATE TABLE IF NOT EXISTS public.user_divisions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- 3. Aktifkan RLS
ALTER TABLE public.user_divisions ENABLE ROW LEVEL SECURITY;

-- 4. Policy: user hanya bisa akses divisi miliknya sendiri
CREATE POLICY "Users can manage own divisions"
  ON public.user_divisions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_user_divisions_user_id
  ON public.user_divisions(user_id);
