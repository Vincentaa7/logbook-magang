"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { LogbookEntry } from "@/lib/supabase/types";
import { deleteEntry } from "@/app/(dashboard)/dashboard/actions";
import { LogbookFormDialog } from "./logbook-form";

const BADGE_COLORS: Record<string, string> = {
  "NOC / Lapangan": "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Maintenance: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Support: "bg-green-500/20 text-green-300 border border-green-500/30",
  "System/Dev": "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  "Admin/Teknis": "bg-rose-500/20 text-rose-300 border border-rose-500/30",
};

function UnitBadge({ unit }: { unit: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        BADGE_COLORS[unit] ?? "bg-slate-700 text-slate-300"
      }`}
    >
      {unit}
    </span>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Yakin ingin menghapus entri ini?")) return;
    startTransition(async () => {
      try {
        await deleteEntry(id);
        toast.success("Entri berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus entri");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}

export function LogbookTable({ entries }: { entries: LogbookEntry[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.deskripsi.toLowerCase().includes(q) ||
      e.unit_divisi.toLowerCase().includes(q) ||
      e.tools.toLowerCase().includes(q) ||
      (e.kendala_solusi ?? "").toLowerCase().includes(q) ||
      e.tanggal.includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari kegiatan..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Table wrapper */}
      <div className="rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 font-semibold whitespace-nowrap">Tanggal</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold whitespace-nowrap">Unit / Divisi</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold min-w-[200px]">Deskripsi</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold min-w-[150px]">Kendala & Solusi</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold whitespace-nowrap">Tools</th>
                <th className="text-center px-4 py-3 text-slate-400 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <span>{search ? "Tidak ada hasil yang cocok" : "Belum ada kegiatan yang dicatat"}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((entry) => (
                  <tr
                    key={entry.id}
                    className="bg-slate-800/20 hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap font-medium">
                      {format(new Date(entry.tanggal + "T00:00:00"), "dd MMM yyyy", { locale: localeId })}
                    </td>
                    <td className="px-4 py-3">
                      <UnitBadge unit={entry.unit_divisi} />
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[250px]">
                      <p className="line-clamp-2">{entry.deskripsi}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[200px]">
                      {entry.kendala_solusi ? (
                        <p className="line-clamp-2">{entry.kendala_solusi}</p>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap max-w-[150px]">
                      <p className="truncate">{entry.tools}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <LogbookFormDialog
                          entry={entry}
                          trigger={
                            <button
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          }
                        />
                        <DeleteButton id={entry.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} entri
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              ← Sebelum
            </button>
            <span className="px-3 py-1.5 text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              Berikut →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
