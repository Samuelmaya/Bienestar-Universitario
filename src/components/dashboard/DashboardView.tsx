import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { EChartsType } from "echarts";
import {
  Users,
  UserCheck,
  Trophy,
  Building2,
  Package,
  ClipboardList,
  CalendarDays,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { obtenerDashboard } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/shared/dtos/dashboard.dto";

/* ═══════════ Paletas ═══════════ */

const COLORS_INVENTARIO = ["#16a34a", "#84cc16", "#65a30d"];
const COLORS_PETICIONES: Record<string, string> = {
  PENDIENTE: "#84cc16",
  APROBADA: "#16a34a",
  RECHAZADA: "#f97316",
  DEVUELTA: "#22c55e",
};
const COLORS_ESPACIOS: Record<string, string> = {
  DISPONIBLE: "#16a34a",
  MANTENIMIENTO: "#84cc16",
};
const BAR_COLOR = "#16a34a";

const CARD_ANIMATION = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const DIAS_ORDEN = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

/* ═══════════ Stat card ═══════════ */

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
  trend?: string;
  sparkline?: number[];
  highlight?: boolean;
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  trend,
  sparkline,
  highlight,
}: StatCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)] group ${
        highlight ? "ring-1 ring-primary/30" : ""
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div
        className="absolute -right-3 -top-3 h-16 w-16 rounded-full opacity-10 transition-transform group-hover:scale-125"
        style={{ background: color }}
      />
      <div className="inline-flex rounded-xl p-2.5 transition" style={{ background: bg, color }}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold tracking-tight">{value.toLocaleString()}</p>
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      {sparkline && sparkline.length > 1 ? (
        <div className="mt-3 h-10">
          <Sparklines data={sparkline}>
            <SparklinesLine color={color} style={{ strokeWidth: 2, fill: "none" }} />
          </Sparklines>
        </div>
      ) : null}
    </motion.div>
  );
}

/* ═══════════ Section wrapper ═══════════ */

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ═══════════ Gauge / Progress Ring ═══════════ */

function ProgressRing({
  value,
  size = 120,
  stroke = 10,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-lg font-bold">{value.toFixed(1)}%</span>
    </div>
  );
}

/* ═══════════ Estado badge ═══════════ */

function EstadoBadge({ estado }: { estado: string }) {
  const colors: Record<string, string> = {
    PENDIENTE: "bg-lime-100 text-lime-800",
    APROBADA: "bg-emerald-100 text-emerald-800",
    RECHAZADA: "bg-orange-100 text-orange-800",
    DEVUELTA: "bg-green-100 text-green-800",
    DISPONIBLE: "bg-emerald-100 text-emerald-800",
    MANTENIMIENTO: "bg-lime-100 text-lime-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[estado] ?? "bg-gray-100 text-gray-700"}`}
    >
      {estado}
    </span>
  );
}

/* ═══════════ Relative time ═══════════ */

function tiempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Justo ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

/* ═══════════ Custom Legend (compact, no clipping) ═══════════ */

function CompactLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: item.color }}
          />
          {item.name}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */

export function DashboardView() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inventarioChartRef = useRef<EChartsType | null>(null);
  const peticionesChartRef = useRef<EChartsType | null>(null);
  const solicitudesChartRef = useRef<EChartsType | null>(null);
  const espaciosChartRef = useRef<EChartsType | null>(null);
  const inventarioBarsRef = useRef<EChartsType | null>(null);
  const solicitudesBarsRef = useRef<EChartsType | null>(null);
  const horariosBarsRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    obtenerDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data) return;
    const timers: number[] = [];

    const startPieLoop = (chart: EChartsType | null, dataLength: number) => {
      if (!chart || dataLength === 0) return;
      let index = 0;
      const timer = window.setInterval(() => {
        chart.dispatchAction({ type: "downplay", seriesIndex: 0 });
        chart.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: index });
        chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: index });
        index = (index + 1) % dataLength;
      }, 2200);
      timers.push(timer);
    };

    const startBarLoop = (chart: EChartsType | null, dataLength: number) => {
      if (!chart || dataLength === 0) return;
      let index = 0;
      const timer = window.setInterval(() => {
        chart.dispatchAction({ type: "downplay", seriesIndex: 0 });
        chart.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: index });
        chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: index });
        index = (index + 1) % dataLength;
      }, 2000);
      timers.push(timer);
    };

    const inventarioPieLength = 3;
    const peticionesLength = Object.keys(data.peticiones.por_estado).length;
    const solicitudesLength = Object.keys(data.solicitudes_espacio.por_estado).length;
    const espaciosLength = data.espacios.por_estado.length;
    const inventarioBarsLength = data.inventario.articulos_por_categoria.length;
    const solicitudesBarsLength = data.solicitudes_espacio.por_espacio.length;
    const horariosLength = DIAS_ORDEN.filter((d) => d in data.deportes.horarios_por_dia).length;

    const startTooltips = window.setTimeout(() => {
      startPieLoop(inventarioChartRef.current, inventarioPieLength);
      startPieLoop(peticionesChartRef.current, peticionesLength);
      startPieLoop(solicitudesChartRef.current, solicitudesLength);
      startPieLoop(espaciosChartRef.current, espaciosLength);
      startBarLoop(inventarioBarsRef.current, inventarioBarsLength);
      startBarLoop(solicitudesBarsRef.current, solicitudesBarsLength);
      startBarLoop(horariosBarsRef.current, horariosLength);
    }, 400);

    return () => {
      window.clearTimeout(startTooltips);
      timers.forEach((timer) => window.clearInterval(timer));
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-destructive">
        <AlertCircle className="h-10 w-10" />
        <p className="text-sm font-medium">{error ?? "No se pudieron cargar los datos"}</p>
      </div>
    );
  }

  const { resumen, inventario, peticiones, solicitudes_espacio, espacios, deportes } = data;

  /* Charts data */
  const inventarioPieData = [
    { name: "Disponible", value: inventario.total_disponible },
    { name: "Reservado", value: inventario.total_reservado },
    { name: "Dañado", value: inventario.total_dañado },
  ];

  const peticionesEstadoData = Object.entries(peticiones.por_estado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad,
  }));

  const solicitudesEstadoData = Object.entries(solicitudes_espacio.por_estado).map(
    ([estado, cantidad]) => ({
      name: estado,
      value: cantidad,
    }),
  );

  const espaciosEstadoData = espacios.por_estado.map((e) => ({
    name: e.estado,
    value: e.cantidad,
  }));

  const horariosData = DIAS_ORDEN.filter((d) => d in deportes.horarios_por_dia).map((d) => ({
    dia: d.slice(0, 3),
    cantidad: deportes.horarios_por_dia[d],
  }));

  const totalSolicitudesPorEstado = solicitudesEstadoData.reduce(
    (acc, item) => acc + item.value,
    0,
  );
  const totalPeticionesPorEstado = peticionesEstadoData.reduce((acc, item) => acc + item.value, 0);
  const totalInventario = inventarioPieData.reduce((acc, item) => acc + item.value, 0);
  const espaciosDisponibles =
    espacios.por_estado.find((e) => e.estado === "DISPONIBLE")?.cantidad ?? 0;
  const peticionesAprobadas = peticiones.por_estado.APROBADA ?? 0;
  const solicitudesAprobadas = solicitudes_espacio.por_estado.APROBADA ?? 0;
  const promedioCupo = deportes.lista.length
    ? Math.round(deportes.lista.reduce((acc, d) => acc + d.cupo_maximo, 0) / deportes.lista.length)
    : 0;

  const inventarioDonut = {
    animationDuration: 800,
    animationEasing: "cubicOut",
    animationDurationUpdate: 600,
    animationEasingUpdate: "cubicOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "80%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#ffffff", borderWidth: 2 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: inventarioPieData.map((d, i) => ({
          ...d,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: COLORS_INVENTARIO[i] },
                { offset: 1, color: `${COLORS_INVENTARIO[i]}cc` },
              ],
            },
          },
        })),
      },
    ],
  };

  const peticionesDonut = {
    animationDuration: 800,
    animationEasing: "cubicOut",
    animationDurationUpdate: 600,
    animationEasingUpdate: "cubicOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "80%"],
        center: ["50%", "50%"],
        itemStyle: { borderRadius: 10, borderColor: "#ffffff", borderWidth: 2 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: peticionesEstadoData.map((d) => ({
          ...d,
          itemStyle: { color: COLORS_PETICIONES[d.name] ?? "#94a3b8" },
        })),
      },
    ],
  };

  const solicitudesDonut = {
    animationDuration: 800,
    animationEasing: "cubicOut",
    animationDurationUpdate: 600,
    animationEasingUpdate: "cubicOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],
        center: ["50%", "50%"],
        itemStyle: { borderRadius: 10, borderColor: "#ffffff", borderWidth: 2 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: solicitudesEstadoData.map((d) => ({
          ...d,
          itemStyle: { color: COLORS_PETICIONES[d.name] ?? "#94a3b8" },
        })),
      },
    ],
  };

  const espaciosDonut = {
    animationDuration: 800,
    animationEasing: "cubicOut",
    animationDurationUpdate: 600,
    animationEasingUpdate: "cubicOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],
        center: ["50%", "50%"],
        itemStyle: { borderRadius: 10, borderColor: "#ffffff", borderWidth: 2 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: espaciosEstadoData.map((d) => ({
          ...d,
          itemStyle: { color: COLORS_ESPACIOS[d.name] ?? "#94a3b8" },
        })),
      },
    ],
  };

  const inventarioBars = {
    animationDuration: 900,
    animationEasing: "cubicOut",
    animationDurationUpdate: 700,
    animationEasingUpdate: "cubicOut",
    grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: "value",
      axisLabel: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: inventario.articulos_por_categoria.map((c) => c.categoria),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: "#64748b" },
    },
    series: [
      {
        type: "bar",
        data: inventario.articulos_por_categoria.map((c) => c.cantidad),
        barWidth: 12,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#22c55e" },
              { offset: 1, color: "#16a34a" },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
    },
  };

  const solicitudesBars = {
    animationDuration: 900,
    animationEasing: "cubicOut",
    animationDurationUpdate: 700,
    animationEasingUpdate: "cubicOut",
    grid: { left: 12, right: 12, top: 16, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: solicitudes_espacio.por_espacio.map((s) => s.nombre_espacio),
      axisLabel: { fontSize: 10, color: "#64748b", rotate: 20 },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11, color: "#64748b" },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        type: "bar",
        data: solicitudes_espacio.por_espacio.map((s) => s.total_solicitudes),
        barWidth: 26,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#16a34a" },
              { offset: 1, color: "#86efac" },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
    },
  };

  const horariosBars = {
    animationDuration: 900,
    animationEasing: "cubicOut",
    animationDurationUpdate: 700,
    animationEasingUpdate: "cubicOut",
    grid: { left: 12, right: 12, top: 12, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: horariosData.map((h) => h.dia),
      axisLabel: { fontSize: 11, color: "#64748b" },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11, color: "#64748b" },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        type: "bar",
        data: horariosData.map((h) => h.cantidad),
        barWidth: 30,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: BAR_COLOR },
              { offset: 1, color: "#34d399" },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "rgba(255,255,255,0.06)",
      textStyle: { color: "#f8fafc", fontSize: 12 },
    },
  };

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-50 via-card to-transparent p-6 shadow-[var(--shadow-elegant)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Usuarios totales
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight">
                  {resumen.total_usuarios.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Activos:{" "}
                  <span className="font-semibold text-foreground">
                    {resumen.usuarios_activos.toLocaleString()}
                  </span>
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" /> Comunidad en crecimiento
                </div>
              </div>
              <div className="hidden sm:block">
                <ProgressRing
                  value={Math.min(
                    100,
                    (resumen.usuarios_activos / Math.max(1, resumen.total_usuarios)) * 100,
                  )}
                  size={120}
                  stroke={10}
                />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={UserCheck}
            label="Activos"
            value={resumen.usuarios_activos}
            color="#16a34a"
            bg="#ecfdf3"
            trend={`${Math.round((resumen.usuarios_activos / Math.max(1, resumen.total_usuarios)) * 100)}% activos`}
            highlight
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={Trophy}
            label="Deportes"
            value={resumen.total_deportes}
            color="#15803d"
            bg="#f0fdf4"
            trend={promedioCupo ? `Prom. cupo ${promedioCupo}` : "Prom. cupo —"}
            sparkline={deportes.lista.map((d) => d.cupo_maximo)}
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={Building2}
            label="Espacios"
            value={resumen.total_espacios}
            color="#22c55e"
            bg="#ecfdf3"
            trend={`${espaciosDisponibles} disponibles`}
            sparkline={espacios.por_estado.map((e) => e.cantidad)}
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={Package}
            label="Artículos"
            value={resumen.total_articulos}
            color="#65a30d"
            bg="#f7fee7"
            trend={`${inventario.total_disponible} disponibles`}
            sparkline={inventario.articulos_por_categoria.map((c) => c.cantidad)}
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={ClipboardList}
            label="Peticiones"
            value={resumen.total_peticiones}
            color="#16a34a"
            bg="#ecfdf3"
            trend={`${peticionesAprobadas} aprobadas`}
            sparkline={peticionesEstadoData.map((p) => p.value)}
          />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={CARD_ANIMATION}
          transition={{ duration: 0.45, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            icon={CalendarDays}
            label="Solicitudes"
            value={resumen.total_solicitudes_espacio}
            color="#22c55e"
            bg="#f0fdf4"
            trend={`${solicitudesAprobadas} aprobadas`}
            sparkline={solicitudesEstadoData.map((s) => s.value)}
          />
        </motion.div>
      </div>

      {/* ── Row 1: Inventario + Peticiones ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inventario dona + barras */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Inventario — Estado general">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
                <div className="relative" style={{ width: 220, height: 220 }}>
                  <ReactECharts
                    option={inventarioDonut}
                    style={{ width: "100%", height: "100%" }}
                    onChartReady={(chart) => {
                      inventarioChartRef.current = chart;
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{totalInventario}</p>
                  </div>
                </div>
                <CompactLegend
                  items={inventarioPieData.map((d, i) => ({
                    name: d.name,
                    color: COLORS_INVENTARIO[i],
                  }))}
                />
              </div>
              {/* Barras por categoría */}
              <div className="flex-1 w-full min-w-0">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Por categoría</p>
                <div
                  style={{
                    width: "100%",
                    height: Math.max(140, inventario.articulos_por_categoria.length * 32),
                  }}
                >
                  <ReactECharts
                    option={inventarioBars}
                    style={{ width: "100%", height: "100%" }}
                    onChartReady={(chart) => {
                      inventarioBarsRef.current = chart;
                    }}
                  />
                </div>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* Peticiones dona + gauge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Peticiones de préstamo">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="relative" style={{ width: 220, height: 220 }}>
                  <ReactECharts
                    option={peticionesDonut}
                    style={{ width: "100%", height: "100%" }}
                    onChartReady={(chart) => {
                      peticionesChartRef.current = chart;
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{totalPeticionesPorEstado}</p>
                  </div>
                </div>
                <CompactLegend
                  items={peticionesEstadoData.map((d) => ({
                    name: d.name,
                    color: COLORS_PETICIONES[d.name] ?? "#94a3b8",
                  }))}
                />
              </div>
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-semibold text-muted-foreground">Tasa de aprobación</p>
                <ProgressRing value={peticiones.tasa_aprobacion} />
                <p className="text-xs text-muted-foreground">Total: {peticiones.total}</p>
              </div>
            </div>
          </Section>
        </motion.div>
      </div>

      {/* ── Row 2: Top reservados + Peticiones recientes ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Top artículos reservados">
            {inventario.top_articulos_reservados.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin reservas registradas</p>
            ) : (
              <div className="divide-y divide-border">
                {inventario.top_articulos_reservados.map((a, i) => (
                  <div key={a.id_articulo} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-accent text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{a.nombre}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {a.cantidad_reservada}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Peticiones recientes">
            {peticiones.recientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay peticiones recientes</p>
            ) : (
              <div className="divide-y divide-border">
                {peticiones.recientes.map((p) => (
                  <div
                    key={p.id_peticion}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.nombre_solicitante}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {tiempoRelativo(p.created_at)}
                      </p>
                    </div>
                    <EstadoBadge estado={p.estado} />
                  </div>
                ))}
              </div>
            )}
          </Section>
        </motion.div>
      </div>

      {/* ── Row 3: Solicitudes espacio ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Solicitudes por espacio">
            <div className="flex flex-col gap-6">
              {/* Dona + tasa */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative" style={{ width: 190, height: 190 }}>
                    <ReactECharts
                      option={solicitudesDonut}
                      style={{ width: "100%", height: "100%" }}
                      onChartReady={(chart) => {
                        solicitudesChartRef.current = chart;
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{totalSolicitudesPorEstado}</p>
                    </div>
                  </div>
                  <CompactLegend
                    items={solicitudesEstadoData.map((d) => ({
                      name: d.name,
                      color: COLORS_PETICIONES[d.name] ?? "#94a3b8",
                    }))}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Aprobación:{" "}
                    <span className="font-semibold text-foreground">
                      {solicitudes_espacio.tasa_aprobacion.toFixed(1)}%
                    </span>
                  </p>
                </div>
                {/* Barras por espacio */}
                <div className="flex-1 w-full min-w-0">
                  <div
                    style={{
                      width: "100%",
                      height: Math.max(160, solicitudes_espacio.por_espacio.length * 40 + 50),
                    }}
                  >
                    <ReactECharts
                      option={solicitudesBars}
                      style={{ width: "100%", height: "100%" }}
                      onChartReady={(chart) => {
                        solicitudesBarsRef.current = chart;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Próximas reservas de espacio">
            {solicitudes_espacio.proximas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay reservas próximas</p>
            ) : (
              <div className="space-y-3">
                {solicitudes_espacio.proximas.map((s) => (
                  <div
                    key={s.id_solicitud}
                    className="flex items-start gap-3 rounded-xl border border-border bg-accent/30 p-3 transition hover:bg-accent/50"
                  >
                    <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{s.nombre_espacio}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        📅 {s.fecha} · ⏰ {s.hora_inicio.slice(0, 5)} – {s.hora_fin.slice(0, 5)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">👤 {s.solicitante}</p>
                    </div>
                    <EstadoBadge estado={s.estado} />
                  </div>
                ))}
              </div>
            )}
          </Section>
        </motion.div>
      </div>

      {/* ── Row 4: Espacios estado + Horarios por día ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Estado de espacios">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div style={{ width: 190, height: 190 }}>
                <ReactECharts
                  option={espaciosDonut}
                  style={{ width: "100%", height: "100%" }}
                  onChartReady={(chart) => {
                    espaciosChartRef.current = chart;
                  }}
                />
              </div>
              <div className="space-y-2">
                {espacios.por_estado.map((e) => (
                  <div key={e.estado} className="flex items-center gap-2">
                    <EstadoBadge estado={e.estado} />
                    <span className="text-sm font-semibold">{e.cantidad}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1">Total: {espacios.total}</p>
              </div>
            </div>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Section title="Horarios por día">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span>
                  Total horarios:{" "}
                  <span className="font-semibold text-foreground">{deportes.total_horarios}</span>
                </span>
              </div>
              <div style={{ width: "100%", height: 200 }}>
                <ReactECharts
                  option={horariosBars}
                  style={{ width: "100%", height: "100%" }}
                  onChartReady={(chart) => {
                    horariosBarsRef.current = chart;
                  }}
                />
              </div>
            </div>
          </Section>
        </motion.div>
      </div>

      {/* ── Row 5: Deportes tabla ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Section title={`Deportes (${deportes.total})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Deporte</th>
                  <th className="pb-2 text-right">Cupo máximo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deportes.lista.map((d) => (
                  <tr key={d.cod_deporte} className="hover:bg-accent/30 transition">
                    <td className="py-2 pr-4 text-muted-foreground">{d.cod_deporte}</td>
                    <td className="py-2 pr-4 font-medium">{d.nom_deporte}</td>
                    <td className="py-2 text-right font-semibold text-primary">{d.cupo_maximo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
