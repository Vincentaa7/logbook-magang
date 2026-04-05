-- ============================================================
-- Logbook Magang — Supabase Full Setup
-- Jalankan SEKALI di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ==========================
-- TABEL 1: logbook_kegiatan
-- ==========================

CREATE TABLE IF NOT EXISTS public.logbook_kegiatan (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tanggal        date NOT NULL,
  unit_divisi    text NOT NULL,
  deskripsi      text NOT NULL,
  kendala_solusi text,
  tools          text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Aktifkan Row Level Security
ALTER TABLE public.logbook_kegiatan ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa akses data miliknya sendiri
CREATE POLICY "Users can view own entries"
  ON public.logbook_kegiatan FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON public.logbook_kegiatan FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.logbook_kegiatan FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.logbook_kegiatan FOR DELETE
  USING (auth.uid() = user_id);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_logbook_user_tanggal
  ON public.logbook_kegiatan(user_id, tanggal DESC);


-- ==========================
-- TABEL 2: user_divisions
-- (Divisi/Unit custom per user)
-- ==========================

CREATE TABLE IF NOT EXISTS public.user_divisions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE public.user_divisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own divisions"
  ON public.user_divisions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_divisions_user_id
  ON public.user_divisions(user_id);


-- ==========================
-- TABEL 3: user_hidden_defaults
-- (Divisi default yang disembunyikan per user)
-- ==========================

CREATE TABLE IF NOT EXISTS public.user_hidden_defaults (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE public.user_hidden_defaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own hidden defaults"
  ON public.user_hidden_defaults FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_hidden_defaults_user_id
  ON public.user_hidden_defaults(user_id);
