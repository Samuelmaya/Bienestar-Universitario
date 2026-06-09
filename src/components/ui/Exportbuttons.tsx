/**
 * ExportButtons.tsx
 * ─────────────────────────────────────────────────────────────
 * Botones de exportación del dashboard (Excel y PDF).
 *
 * Uso dentro de DashboardView (o donde quieras colocarlos):
 *
 *   import { ExportButtons } from "@/components/ExportButtons";
 *   ...
 *   <ExportButtons />
 *
 * El componente llama al endpoint:
 *   GET /dashboard/export?format=excel
 *   GET /dashboard/export?format=pdf
 *
 * y dispara la descarga del archivo en el navegador.
 */

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import {exportarDashboard} from "@/services/dashboard.service";
import { environment } from "@/shared/environments/environment";
// ── Ajusta esta URL al prefijo que uses en tu API ──────────────────────

type ExportFormat = "excel" | "pdf";

type ButtonState = {
  loading: boolean;
  error: string | null;
};

async function triggerDownload(format: ExportFormat) {
  const blob = await exportarDashboard(format);
  const url = URL.createObjectURL(blob);

  // Crear un enlace de descarga
  const a = document.createElement("a");
  a.href = url;
  a.download = format === "excel" ? "dashboard.xlsx" : "dashboard.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Liberar memoria del objeto URL
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// ── Componente ────────────────────────────────────────────────────────

export function ExportButtons() {
  const [excelState, setExcelState] = useState<ButtonState>({
    loading: false,
    error: null,
  });
  const [pdfState, setPdfState] = useState<ButtonState>({
    loading: false,
    error: null,
  });

  const handleExport = async (format: ExportFormat) => {
    const setState =
      format === "excel" ? setExcelState : setPdfState;

    setState({ loading: true, error: null });
    try {
      await triggerDownload(format);
      setState({ loading: false, error: null });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      });
      // Limpiar mensaje de error tras 5 s
      setTimeout(
        () => setState((prev) => ({ ...prev, error: null })),
        5000,
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── Excel ── */}
      <button
        onClick={() => handleExport("excel")}
        disabled={excelState.loading || pdfState.loading}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
          "border border-emerald-600 bg-emerald-50 text-emerald-700",
          "transition hover:bg-emerald-100 active:scale-95",
          "disabled:cursor-not-allowed disabled:opacity-50",
          excelState.error
            ? "border-red-400 bg-red-50 text-red-600"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title={excelState.error ?? "Descargar Excel"}
      >
        {excelState.loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        {excelState.loading
          ? "Generando…"
          : excelState.error
            ? "Error — reintentar"
            : "Exportar Excel"}
      </button>

      {/* ── PDF ── */}
      <button
        onClick={() => handleExport("pdf")}
        disabled={excelState.loading || pdfState.loading}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
          "border border-green-700 bg-green-700 text-white",
          "transition hover:bg-green-800 active:scale-95",
          "disabled:cursor-not-allowed disabled:opacity-50",
          pdfState.error
            ? "border-red-500 bg-red-500 text-white"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title={pdfState.error ?? "Descargar PDF"}
      >
        {pdfState.loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {pdfState.loading
          ? "Generando…"
          : pdfState.error
            ? "Error — reintentar"
            : "Exportar PDF"}
      </button>

      {/* Ícono decorativo (opcional, puedes eliminar) */}
      <Download className="h-4 w-4 text-muted-foreground/40" />
    </div>
  );
}