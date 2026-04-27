import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { CalendarCheck, MapPin, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/reservas")({
  head: () => ({ meta: [{ title: "Reservas — UPC" }] }),
  component: ReservasPage,
});

function ReservasPage() {
  return (
    <>
      <PageHeader
        title="Reservas"
        subtitle="Gestiona tus reservas de implementos deportivos y lugares."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/reservas/lugares"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="inline-flex rounded-xl bg-accent p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Reservar Lugares</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Reserva canchas, gimnasios y demás espacios deportivos.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Reservar lugar →
            </span>
          </Link>

          <Link
            to="/reservas/articulos"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="inline-flex rounded-xl bg-accent p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Reservar Artículos</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Solicita préstamos de implementos y artículos deportivos.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Reservar artículo →
            </span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex rounded-xl bg-accent p-3 text-primary">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Mis Reservas</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Consulta el estado de tus reservas activas.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              Próximamente
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
