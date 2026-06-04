import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VacacionalesView } from "@/components/vacacionales/VacacionalesView";

export const Route = createFileRoute("/vacacionales")({
  head: () => ({
    meta: [
      { title: "Inscripción Vacacional — Bienestar Deportivo UPC" },
      {
        name: "description",
        content:
          "Formulario de inscripción a los cursos vacacionales del área de Bienestar Deportivo de la Universidad Popular del Cesar.",
      },
    ],
  }),
  component: VacacionalesPage,
});

function VacacionalesPage() {
  const navigate = useNavigate();
  return <VacacionalesView onVolver={() => navigate({ to: "/" })} />;
}
