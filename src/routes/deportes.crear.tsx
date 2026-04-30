import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sportsApi } from "@/lib/api";

export const Route = createFileRoute("/deportes/crear")({
  head: () => ({ meta: [{ title: "Crear deporte — UPC" }] }),
  component: DeportesCrearPage,
});

function DeportesCrearPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom_deporte: "",
    descripcion: "",
    categoria: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom_deporte || !form.descripcion) {
      setError("Por favor completa los campos requeridos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sportsApi.create({
        nom_deporte: form.nom_deporte,
        descripcion: form.descripcion,
        categoria: form.categoria ? parseInt(form.categoria) : undefined,
      });
      setDone(true);
      setTimeout(() => {
        navigate({ to: "/deportes/listar" });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear deporte");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Deporte creado!</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Crear Deporte" subtitle="Registra un nuevo deporte en el sistema." />
      <section className="container mx-auto px-4 py-10">
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Nuevo Deporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label>Nombre del deporte</Label>
                <Input
                  value={form.nom_deporte}
                  onChange={(e) => setForm({ ...form, nom_deporte: e.target.value })}
                  placeholder="Fútbol, Baloncesto..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Breve descripción"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoría (opcional)</Label>
                <Input
                  type="number"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  placeholder="ID de categoría"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creando..." : "Crear Deporte"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
