const medals = [
  {
    id: 1,
    estudiante: "Harold Solano",
    disciplina: "Taekwondo",
    evento: "Panamericanos 2026",
    modalidad: "INDIVIDUAL",
  },
  {
    id: 2,
    estudiante: "María Gómez",
    disciplina: "Fútbol",
    evento: "Torneo UPC",
    modalidad: "GRUPAL",
  },
];

export default function MedalTable() {
  return (
    <table className="w-full">

      <thead className="bg-gray-50 border-b">
        <tr className="text-left">

          <th className="px-6 py-4 text-sm font-semibold text-gray-600">
            ID
          </th>

          <th className="px-6 py-4 text-sm font-semibold text-gray-600">
            ESTUDIANTE
          </th>

          <th className="px-6 py-4 text-sm font-semibold text-gray-600">
            DISCIPLINA
          </th>

          <th className="px-6 py-4 text-sm font-semibold text-gray-600">
            EVENTO
          </th>

          <th className="px-6 py-4 text-sm font-semibold text-gray-600">
            MODALIDAD
          </th>

          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
            ACCIONES
          </th>

        </tr>
      </thead>

      <tbody>
        {medals.map((medal) => (
          <tr
            key={medal.id}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >

            <td className="px-6 py-4 text-sm text-gray-700">
              #{medal.id}
            </td>

            <td className="px-6 py-4 font-medium text-gray-900">
              {medal.estudiante}
            </td>

            <td className="px-6 py-4 text-sm text-gray-700">
              {medal.disciplina}
            </td>

            <td className="px-6 py-4 text-sm text-gray-700">
              {medal.evento}
            </td>

            <td className="px-6 py-4">
              <span
                className="
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                "
              >
                {medal.modalidad}
              </span>
            </td>

            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">

                <button
                  className="
                    border
                    border-green-500
                    text-green-700
                    px-4
                    py-1.5
                    rounded-xl
                    text-sm
                    font-medium
                    hover:bg-green-50
                    transition
                  "
                >
                  Editar
                </button>

                <button
                  className="
                    border
                    border-red-300
                    text-red-500
                    px-4
                    py-1.5
                    rounded-xl
                    text-sm
                    font-medium
                    hover:bg-red-50
                    transition
                  "
                >
                  Eliminar
                </button>

              </div>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  );
}