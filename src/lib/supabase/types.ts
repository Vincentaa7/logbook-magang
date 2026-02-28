export type UnitDivisi =
  | "NOC / Lapangan"
  | "Maintenance"
  | "Support"
  | "System/Dev"
  | "Admin/Teknis";

export const UNIT_DIVISI_OPTIONS: UnitDivisi[] = [
  "NOC / Lapangan",
  "Maintenance",
  "Support",
  "System/Dev",
  "Admin/Teknis",
];

export interface LogbookEntry {
  id: string;
  user_id: string;
  tanggal: string; // ISO date string "YYYY-MM-DD"
  unit_divisi: UnitDivisi;
  deskripsi: string;
  kendala_solusi: string | null;
  tools: string;
  created_at: string;
}
