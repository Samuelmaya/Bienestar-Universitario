import MedalTable from "./MedalTable";

export function MedallasGeneral() {
  return (
    <div className="w-full px-6 py-8">
      
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[48px] font-bold tracking-tight text-black">
            Gestión de Premios
          </h1>

          <p className="text-[20px] text-gray-600 mt-2">
            Administra las medallas y logros deportivos de los estudiantes.
          </p>
        </div>

        <button
          className="
            bg-[#008236]
            hover:bg-[#006d2d]
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            text-lg
            transition
            shadow-sm
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
          rounded-[30px]
          overflow-hidden
          shadow-sm
        "
      >
        <MedalTable />
      </div>
    </div>
  );
}