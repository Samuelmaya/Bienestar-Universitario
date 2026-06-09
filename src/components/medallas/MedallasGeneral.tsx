import MedalTable from "./MedalTable";

export function MedallasGeneral() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gestión de Medallas
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Nueva Medalla
        </button>
      </div>

      <MedalTable />
    </div>
  );
}