import { createFileRoute } from "@tanstack/react-router";

import MedalTable from "../components/medallas/MedalTable";

export const Route = createFileRoute("/medallas")({
  component: MedallasPage,
});

function MedallasPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gestión de Medallas
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Nueva Medalla
        </button>
      </div>

      <MedalTable />
    </div>
  );
}