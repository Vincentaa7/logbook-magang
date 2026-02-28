"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PlusCircle, X, Loader2 } from "lucide-react";
import type { LogbookEntry } from "@/lib/supabase/types";
import { createEntry, updateEntry } from "@/app/(dashboard)/dashboard/actions";
import { DivisionSelector } from "./division-selector";

interface LogbookFormDialogProps {
  entry?: LogbookEntry;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function LogbookFormDialog({ entry, onSuccess, trigger }: LogbookFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!entry;

  async function handleSubmit(formData: FormData) {
    const unitDivisi = formData.get("unit_divisi") as string;
    if (!unitDivisi) {
      toast.error("Pilih unit/divisi terlebih dahulu");
      return;
    }
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateEntry(formData);
          toast.success("Entri berhasil diperbarui!");
        } else {
          await createEntry(formData);
          toast.success("Entri berhasil ditambahkan!");
        }
        setOpen(false);
        onSuccess?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      }
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ?? (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/25">
            <PlusCircle className="w-4 h-4" />
            Tambah Kegiatan
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isEditing ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
              </h2>
              <button onClick={() => !isPending && setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="p-6 space-y-5">
              {isEditing && <input type="hidden" name="id" value={entry.id} />}

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Tanggal */}
                <div className="space-y-1.5">
                  <label htmlFor="tanggal" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="tanggal" name="tanggal" type="date" required
                    defaultValue={entry?.tanggal ?? today}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                </div>

                {/* Unit Divisi — Dynamic */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Unit / Divisi <span className="text-red-500">*</span>
                  </label>
                  <DivisionSelector defaultValue={entry?.unit_divisi} />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label htmlFor="deskripsi" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Deskripsi Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="deskripsi" name="deskripsi" required rows={3}
                  defaultValue={entry?.deskripsi ?? ""}
                  placeholder="Contoh: Konfigurasi Routerboard RB750, set IP Address, DHCP Server..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
                />
              </div>

              {/* Kendala & Solusi */}
              <div className="space-y-1.5">
                <label htmlFor="kendala_solusi" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kendala &amp; Solusi <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  id="kendala_solusi" name="kendala_solusi" rows={2}
                  defaultValue={entry?.kendala_solusi ?? ""}
                  placeholder="Contoh: Link down karena kabel putus — Solusi: Ganti kabel FO"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
                />
              </div>

              {/* Tools */}
              <div className="space-y-1.5">
                <label htmlFor="tools" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tools / Perangkat <span className="text-red-500">*</span>
                </label>
                <input
                  id="tools" name="tools" type="text" required
                  defaultValue={entry?.tools ?? ""}
                  placeholder="Contoh: Winbox, Zabbix, OTDR, VS Code"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setOpen(false)} disabled={isPending}
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</> : isEditing ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
