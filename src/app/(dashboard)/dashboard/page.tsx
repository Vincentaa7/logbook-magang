import { createClient } from "@/lib/supabase/server";
import { LogbookTable } from "@/components/logbook-table";
import { LogbookFormDialog } from "@/components/logbook-form";
import { ExportButtons } from "@/components/export-buttons";
import type { LogbookEntry } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries, error } = await supabase
    .from("logbook_kegiatan")
    .select("*")
    .eq("user_id", user!.id)
    .order("tanggal", { ascending: false })
    .returns<LogbookEntry[]>();

  const logbooks: LogbookEntry[] = entries ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Logbook</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {logbooks.length} aktivitas tercatat
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportButtons entries={logbooks} userEmail={user!.email ?? ""} />
          <LogbookFormDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Kegiatan", value: logbooks.length, icon: "📋", color: "blue" },
          {
            label: "Bulan Ini",
            value: logbooks.filter((e) => {
              const d = new Date(e.tanggal);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length,
            icon: "📅",
            color: "purple",
          },
          {
            label: "Unit Unik",
            value: new Set(logbooks.map((e) => e.unit_divisi)).size,
            icon: "🏢",
            color: "green",
          },
          {
            label: "Minggu Ini",
            value: logbooks.filter((e) => {
              const d = new Date(e.tanggal);
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
              return diffDays <= 7;
            }).length,
            icon: "⚡",
            color: "amber",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          Gagal memuat data: {error.message}
        </div>
      )}

      {/* Table */}
      <LogbookTable entries={logbooks} />
    </div>
  );
}
