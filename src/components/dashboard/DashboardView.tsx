import { useEffect, useState } from "react";
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
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { obtenerDashboard } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/shared/dtos/dashboard.dto";

/* ═══════════ Paletas ═══════════ */

const COLORS_INVENTARIO = ["#22c55e", "#f59e0b", "#ef4444"];
const COLORS_PETICIONES: Record<string, string> = {
  PENDIENTE: "#f59e0b",
  APROBADA: "#22c55e",
  RECHAZADA: "#ef4444",
  DEVUELTA: "#3b82f6",
};
const COLORS_ESPACIOS: Record<string, string> = {
  DISPONIBLE: "#22c55e",
  MANTENIMIENTO: "#f59e0b",
};
const BAR_COLOR = "#10a34a";
const BAR_COLOR_ALT = "#3b82f6";

const DIAS_ORDEN = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

/* ═══════════ Stat card ═══════════ */

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
};

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)] group">
      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full opacity-10 transition-transform group-hover:scale-125" style={{ background: color }} />
      <div className="inline-flex rounded-xl p-2.5 transition" style={{ background: bg, color }}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/* ═══════════ Section wrapper ═══════════ */

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      {children}
    </section>
  );
}

/* ═══════════ Gauge / Progress Ring ═══════════ */

function ProgressRing({ value, size = 120, stroke = 10 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
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
    PENDIENTE: "bg-amber-100 text-amber-800",
    APROBADA: "bg-emerald-100 text-emerald-800",
    RECHAZADA: "bg-red-100 text-red-800",
    DEVUELTA: "bg-blue-100 text-blue-800",
    DISPONIBLE: "bg-emerald-100 text-emerald-800",
    MANTENIMIENTO: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[estado] ?? "bg-gray-100 text-gray-700"}`}>
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

/* ═══════════ Custom tooltip ═══════════ */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          {p.name ?? "Cantidad"}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════ Custom Legend (compact, no clipping) ═══════════ */

function CompactLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: item.color }} />
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

  useEffect(() => {
    obtenerDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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

  const solicitudesEstadoData = Object.entries(solicitudes_espacio.por_estado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad,
  }));

  const espaciosEstadoData = espacios.por_estado.map((e) => ({
    name: e.estado,
    value: e.cantidad,
  }));

  const horariosData = DIAS_ORDEN
    .filter((d) => d in deportes.horarios_por_dia)
    .map((d) => ({ dia: d.slice(0, 3), cantidad: deportes.horarios_por_dia[d] }));

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard icon={Users} label="Usuarios" value={resumen.total_usuarios} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon={UserCheck} label="Activos" value={resumen.usuarios_activos} color="#22c55e" bg="#f0fdf4" />
        <StatCard icon={Trophy} label="Deportes" value={resumen.total_deportes} color="#f97316" bg="#fff7ed" />
        <StatCard icon={Building2} label="Espacios" value={resumen.total_espacios} color="#8b5cf6" bg="#f5f3ff" />
        <StatCard icon={Package} label="Artículos" value={resumen.total_articulos} color="#06b6d4" bg="#ecfeff" />
        <StatCard icon={ClipboardList} label="Peticiones" value={resumen.total_peticiones} color="#eab308" bg="#fefce8" />
        <StatCard icon={CalendarDays} label="Solicitudes" value={resumen.total_solicitudes_espacio} color="#ec4899" bg="#fdf2f8" />
      </div>

      {/* ── Row 1: Inventario + Peticiones ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inventario dona + barras */}
        <Section title="Inventario — Estado general">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
              <div style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={inventarioPieData} innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {inventarioPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS_INVENTARIO[i]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CompactLegend items={inventarioPieData.map((d, i) => ({ name: d.name, color: COLORS_INVENTARIO[i] }))} />
            </div>
            {/* Barras por categoría */}
            <div className="flex-1 w-full min-w-0">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Por categoría</p>
              <div style={{ width: "100%", height: Math.max(140, inventario.articulos_por_categoria.length * 32) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventario.articulos_por_categoria} layout="vertical" margin={{ left: 4, right: 8, top: 4, bottom: 4 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="categoria" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cantidad" fill={BAR_COLOR} radius={[0, 6, 6, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Section>

        {/* Peticiones dona + gauge */}
        <Section title="Peticiones de préstamo">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={peticionesEstadoData} innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {peticionesEstadoData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS_PETICIONES[entry.name] ?? "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CompactLegend items={peticionesEstadoData.map((d) => ({ name: d.name, color: COLORS_PETICIONES[d.name] ?? "#94a3b8" }))} />
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-semibold text-muted-foreground">Tasa de aprobación</p>
              <ProgressRing value={peticiones.tasa_aprobacion} />
              <p className="text-xs text-muted-foreground">Total: {peticiones.total}</p>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Row 2: Top reservados + Peticiones recientes ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Top artículos reservados">
          {inventario.top_articulos_reservados.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin reservas registradas</p>
          ) : (
            <div className="divide-y divide-border">
              {inventario.top_articulos_reservados.map((a, i) => (
                <div key={a.id_articulo} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-accent text-xs font-bold text-primary">{i + 1}</span>
                    <span className="text-sm font-medium">{a.nombre}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{a.cantidad_reservada}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Peticiones recientes">
          {peticiones.recientes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay peticiones recientes</p>
          ) : (
            <div className="divide-y divide-border">
              {peticiones.recientes.map((p) => (
                <div key={p.id_peticion} className="flex items-center justify-between gap-3 py-2.5">
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
      </div>

      {/* ── Row 3: Solicitudes espacio ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Solicitudes por espacio">
          <div className="flex flex-col gap-6">
            {/* Dona + tasa */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <div style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={solicitudesEstadoData} innerRadius={48} outerRadius={75} dataKey="value" paddingAngle={3} strokeWidth={0}>
                        {solicitudesEstadoData.map((entry) => (
                          <Cell key={entry.name} fill={COLORS_PETICIONES[entry.name] ?? "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <CompactLegend items={solicitudesEstadoData.map((d) => ({ name: d.name, color: COLORS_PETICIONES[d.name] ?? "#94a3b8" }))} />
                <p className="text-xs text-muted-foreground mt-2">
                  Aprobación: <span className="font-semibold text-foreground">{solicitudes_espacio.tasa_aprobacion.toFixed(1)}%</span>
                </p>
              </div>
              {/* Barras por espacio */}
              <div className="flex-1 w-full min-w-0">
                <div style={{ width: "100%", height: Math.max(160, solicitudes_espacio.por_espacio.length * 40 + 50) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={solicitudes_espacio.por_espacio} margin={{ left: 4, right: 8, top: 4, bottom: 30 }}>
                      <XAxis dataKey="nombre_espacio" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="total_solicitudes" name="Solicitudes" fill={BAR_COLOR_ALT} radius={[6, 6, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Próximas reservas de espacio">
          {solicitudes_espacio.proximas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay reservas próximas</p>
          ) : (
            <div className="space-y-3">
              {solicitudes_espacio.proximas.map((s) => (
                <div key={s.id_solicitud} className="flex items-start gap-3 rounded-xl border border-border bg-accent/30 p-3 transition hover:bg-accent/50">
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
      </div>

      {/* ── Row 4: Espacios estado + Horarios por día ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Estado de espacios">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={espaciosEstadoData} innerRadius={48} outerRadius={75} dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {espaciosEstadoData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS_ESPACIOS[entry.name] ?? "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
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

        <Section title="Horarios por día">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span>Total horarios: <span className="font-semibold text-foreground">{deportes.total_horarios}</span></span>
            </div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horariosData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cantidad" name="Horarios" fill={BAR_COLOR} radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Row 5: Deportes tabla ── */}
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
    </div>
  );
}
