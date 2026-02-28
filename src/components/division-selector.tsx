"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_DIVISIONS, type Division } from "@/lib/supabase/types";
import { createDivision, deleteDivision } from "@/app/(dashboard)/dashboard/division-actions";

interface DivisionSelectorProps {
  defaultValue?: string;
}

export function DivisionSelector({ defaultValue }: DivisionSelectorProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selected, setSelected] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("user_divisions")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setDivisions(data ?? []);
        setLoading(false);
      });
  }, []);

  const allOptions = divisions.length > 0
    ? divisions.map((d) => d.name)
    : DEFAULT_DIVISIONS;

  function handleSelect(name: string) {
    setSelected(name);
    setOpen(false);
  }

  function handleAdd() {
    if (!newName.trim()) return;
    startTransition(async () => {
      try {
        await createDivision(newName.trim());
        // Refresh list
        const supabase = createClient();
        const { data } = await supabase
          .from("user_divisions")
          .select("*")
          .order("created_at", { ascending: true });
        setDivisions(data ?? []);
        setSelected(newName.trim());
        setNewName("");
        setShowAdd(false);
        toast.success(`Divisi "${newName.trim()}" ditambahkan`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menambah divisi");
      }
    });
  }

  function handleDelete(div: Division) {
    startTransition(async () => {
      try {
        await deleteDivision(div.id);
        setDivisions((prev) => prev.filter((d) => d.id !== div.id));
        if (selected === div.name) setSelected("");
        toast.success(`Divisi "${div.name}" dihapus`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menghapus divisi");
      }
    });
  }

  return (
    <div className="relative">
      {/* Hidden input for form submission */}
      <input type="hidden" name="unit_divisi" value={selected} required />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <span className={selected ? "" : "text-slate-400 dark:text-slate-500"}>
          {loading ? "Memuat..." : selected || "Pilih unit/divisi"}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {allOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-400 text-center">
                  Belum ada divisi. Tambahkan di bawah.
                </div>
              ) : (
                allOptions.map((name) => {
                  const divObj = divisions.find((d) => d.name === name);
                  return (
                    <div
                      key={name}
                      className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer group transition-colors
                        ${selected === name
                          ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                      <span className="flex-1" onClick={() => handleSelect(name)}>
                        {name}
                        {!divObj && (
                          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">(default)</span>
                        )}
                      </span>
                      {divObj && (
                        <button
                          type="button"
                          onClick={() => handleDelete(divObj)}
                          disabled={isPending}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition"
                          title="Hapus divisi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add new divisi */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-2">
              {showAdd ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Nama divisi baru..."
                    autoFocus
                    className="flex-1 px-2 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isPending || !newName.trim()}
                    className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition"
                  >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAdd(false); setNewName(""); }}
                    className="px-2 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Divisi Baru
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
