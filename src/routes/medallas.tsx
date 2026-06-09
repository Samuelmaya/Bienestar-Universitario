import { createFileRoute } from "@tanstack/react-router";

import MedalTable from "../components/medallas/MedalTable";

export const Route = createFileRoute("/medallas")({
  component: MedallasPage,
});

function MedallasPage() {
  return (
    <div className="p-5">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">

        <div>
          <h1 className="text-2xl font-bold text-black">
            Gestión de Medallas
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Administra las medallas y logros deportivos de los estudiantes.
          </p>
        </div>

        <button
          className="
            bg-[#008236]
            hover:bg-[#006d2d]
            text-white
            px-5
            py-2.5
            rounded-2xl
            font-medium
            text-sm
            transition
          "
        >
          + Nueva medalla
        </button>

      </div>

      {/* TABLA */}
      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-[24px]
          overflow-hidden
          shadow-sm
        "
      >
        <MedalTable />
      </div>

    </div>
  );
}