"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { LogbookEntry } from "@/lib/supabase/types";

interface ExportButtonsProps {
  entries: LogbookEntry[];
  userEmail: string;
}

export function ExportButtons({ entries, userEmail }: ExportButtonsProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  function exportCSV() {
    setExporting("csv");
    try {
      import("papaparse").then(({ default: Papa }) => {
        const rows = entries.map((e) => ({
          Tanggal: e.tanggal,
          "Unit / Divisi": e.unit_divisi,
          Deskripsi: e.deskripsi,
          "Kendala & Solusi": e.kendala_solusi ?? "",
          Tools: e.tools,
        }));

        const csv = Papa.unparse(rows, { delimiter: ";" });
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `logbook_${userEmail.split("@")[0]}_${format(new Date(), "yyyyMMdd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setExporting(null);
        setOpen(false);
      });
    } catch {
      setExporting(null);
    }
  }

  function exportPDF() {
    setExporting("pdf");
    try {
      Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]).then(([{ default: jsPDF }, { default: autoTable }]) => {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("LOGBOOK KEGIATAN MAGANG", 148, 18, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Nama: ${userEmail}`, 14, 28);
        doc.text(
          `Tanggal Export: ${format(new Date(), "dd MMMM yyyy", { locale: localeId })}`,
          14,
          34
        );
        doc.text(`Total Entri: ${entries.length}`, 14, 40);

        const tableData = entries.map((e, idx) => [
          idx + 1,
          e.tanggal,
          e.unit_divisi,
          e.deskripsi,
          e.kendala_solusi ?? "-",
          e.tools,
        ]);

        // ✅ Panggil autoTable sebagai fungsi (bukan method), untuk kompatibilitas dynamic import
        autoTable(doc, {
          startY: 46,
          head: [["No", "Tanggal", "Unit/Divisi", "Deskripsi", "Kendala & Solusi", "Tools"]],
          body: tableData,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 22 },
            2: { cellWidth: 30 },
            3: { cellWidth: 80 },
            4: { cellWidth: 60 },
            5: { cellWidth: 40 },
          },
        });

        doc.save(
          `logbook_${userEmail.split("@")[0]}_${format(new Date(), "yyyyMMdd")}.pdf`
        );
        setExporting(null);
        setOpen(false);
      });
    } catch {
      setExporting(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={entries.length === 0 || !!exporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Export
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 z-20 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden">
            <button
              onClick={exportCSV}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              Export ke CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700/50"
            >
              <FileText className="w-4 h-4 text-red-400" />
              Export ke PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
