import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InscripcionView } from "@/components/inscripcion/InscripcionView";

export const Route = createFileRoute("/inscripcion")({
  head: () => ({
    meta: [
      { title: "Inscripción Deportiva — Bienestar UPC" },
      {
        name: "description",
        content:
          "Formulario de inscripción a disciplinas deportivas de la Universidad Popular del Cesar.",
      },
    ],
  }),
  component: InscripcionPage,
});

function InscripcionPage() {
  const navigate = useNavigate();

  return (
    <InscripcionView
      onVolver={() => navigate({ to: "/" })}
    />
  );
}