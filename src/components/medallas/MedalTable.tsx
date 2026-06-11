import type { Medal } from "@/shared/dtos/medal.dto";

type Props = {
  medals: Medal[];
  onEdit: (medal: Medal, e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (medal: Medal, e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function MedalTable({ medals, onEdit, onDelete }: Props) {
  return (
    <table className="w-full min-w-[1200px]">
      <thead className="bg-gray-50 border-b">
        <tr className="text-left">
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">ESTUDIANTE</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">CARRERA</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">DISCIPLINA</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">FECHA</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">EVENTO</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">CIUDAD</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">MEDALLA</th>
          <th className="px-4 py-3 text-sm font-semibold text-gray-600">MODALIDAD</th>
          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">ACCIONES</th>
        </tr>
      </thead>

      <tbody>
        {medals.length === 0 ? (
          <tr>
            <td colSpan={10} className="text-center py-10 text-gray-500">
              No hay medallas registradas
            </td>
          </tr>
        ) : (
          medals.map((medal) => (
            <tr
              key={medal.id_medalla}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="px-4 py-4 text-sm text-gray-700">#{medal.id_medalla}</td>
              <td className="px-4 py-4 font-medium text-gray-900">{medal.nombre_estudiante}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{medal.carrera}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{medal.disciplina}</td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {medal.fecha ? new Date(medal.fecha).toLocaleDateString("es-CO") : "-"}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">{medal.evento}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{medal.ciudad_evento}</td>

              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    medal.tipo_medalla === "ORO"
                      ? "bg-yellow-100 text-yellow-700"
                      : medal.tipo_medalla === "PLATA"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {medal.tipo_medalla === "ORO" && "🥇 "}
                  {medal.tipo_medalla === "PLATA" && "🥈 "}
                  {medal.tipo_medalla === "BRONCE" && "🥉 "}
                  {medal.tipo_medalla}
                </span>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    medal.modalidad === "INDIVIDUAL"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {medal.modalidad}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => onEdit(medal, e)}
                    className="border border-green-500 text-green-700 px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-green-50 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => onDelete(medal, e)}
                    className="border border-red-300 text-red-500 px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}