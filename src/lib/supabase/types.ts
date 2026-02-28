export type UnitDivisi = string; // Now dynamic — stored in user_divisions table

export interface Division {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

// Default divisions shown as suggestions for new users
export const DEFAULT_DIVISIONS: string[] = [
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
  unit_divisi: string;
  deskripsi: string;
  kendala_solusi: string | null;
  tools: string;
  created_at: string;
}

