import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Search, Medal, Trophy, Users, Timer, CheckCircle2, AlertCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — UPC Deportes" }] }),
  component: () => (
    <RequireAuth roles={["administrador", "utilero"]}>
      <DashboardPage />
    </RequireAuth>
  ),
});

// Datos de ejemplos
const stats = {
  totalUsers: 1248,
  activeReservations: 23,
  pendingReturns: 8,
  totalSports: 15,
};

// Datos de estudiantes registrados por género
const genderStats = [
  { name: "Hombres", value: 720, color: "#3b82f6" },
  { name: "Mujeres", value: 528, color: "#ec4899" },
];

// Datos mensuales para gráfica de barras
const monthlyStats = [
  { month: "Ene", hombres: 120, mujeres: 95 },
  { month: "Feb", hombres: 135, mujeres: 110 },
  { month: "Mar", hombres: 150, mujeres: 125 },
  { month: "Abr", hombres: 145, mujeres: 130 },
  { month: "May", hombres: 170, mujeres: 68 },
];

const topSports = [
  { name: "Fútbol", reservations: 45, icon: "⚽" },
  { name: "Baloncesto", reservations: 32, icon: "🏀" },
  { name: "Voleibol", reservations: 28, icon: "🏐" },
  { name: "Tenis", reservations: 19, icon: "🎾" },
  { name: "Natación", reservations: 15, icon: "🏊" },
];

const recentReservations = [
  {
    id: "RES-2024-0156",
    user: "María González",
    sport: "Fútbol",
    date: "2024-12-20",
    status: "approved" as const,
  },
  {
    id: "RES-2024-0155",
    user: "Carlos Rodríguez",
    sport: "Baloncesto",
    date: "2024-12-20",
    status: "pending" as const,
  },
  {
    id: "RES-2024-0154",
    user: "Ana López",
    sport: "Tenis",
    date: "2024-12-19",
    status: "completed" as const,
  },
];

type ReservationStatus = "approved" | "pending" | "completed";

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen general del bienestar deportivo." />

      <section className="container mx-auto px-4 py-10">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Usuarios Totales</p>
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">+12% este mes</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Reservas Activas</p>
            </div>
            <p className="text-3xl font-bold text-primary">{stats.activeReservations}</p>
            <p className="text-sm text-muted-foreground mt-1">3 devoluciones pendientes</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 mb-2">
              <Timer className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Devoluciones Pendientes</p>
            </div>
            <p className="text-3xl font-bold text-primary">{stats.pendingReturns}</p>
            <p className="text-sm text-destructive mt-1">Requiere atención</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 mb-2">
              <Medal className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Articulos Disponibles</p>
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalSports}</p>
            <p className="text-sm text-muted-foreground mt-1">5 en mantenimiento</p>
          </div>
        </div>

        {/* Gráficas de Género */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
          {/* Gráfica circular de género */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              Estudiantes por Género
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} estudiantes`, "Total"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-2xl font-bold text-blue-600">{genderStats[0].value}</p>
                <p className="text-sm text-blue-700">Hombres</p>
              </div>
              <div className="rounded-lg bg-pink-50 p-3">
                <p className="text-2xl font-bold text-pink-600">{genderStats[1].value}</p>
                <p className="text-sm text-pink-700">Mujeres</p>
              </div>
            </div>
          </div>

          {/* Gráfica de barras por mes */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              Registro Mensual por Género
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hombres" fill="#3b82f6" name="Hombres" />
                  <Bar dataKey="mujeres" fill="#ec4899" name="Mujeres" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Sports */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Articulos Más Reservados
            </h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar deporte..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-4">
            {topSports.map((sport, index) => (
              <div
                key={sport.name}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {sport.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{sport.name}</h3>
                    <p className="text-sm text-muted-foreground">{sport.reservations} reservas</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Reservas Recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Deporte</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentReservations.map((reservation) => {
                  const statusClass =
                    reservation.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800";
                  const statusText =
                    reservation.status === "approved"
                      ? "Aprobada"
                      : reservation.status === "pending"
                        ? "Pendiente"
                        : "Completada";
                  return (
                    <tr key={reservation.id} className="hover:bg-accent/40">
                      <td className="px-4 py-3 font-mono text-xs">{reservation.id}</td>
                      <td className="px-4 py-3 font-medium">{reservation.user}</td>
                      <td className="px-4 py-3">{reservation.sport}</td>
                      <td className="px-4 py-3 text-muted-foreground">{reservation.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
