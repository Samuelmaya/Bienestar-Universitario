export default function MedalTable() {
  return (
    <div className="bg-white rounded shadow p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Estudiante</th>
            <th className="text-left p-2">Disciplina</th>
            <th className="text-left p-2">Evento</th>
            <th className="text-left p-2">Ciudad</th>
            <th className="text-left p-2">Modalidad</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-2">Juan Pérez</td>
            <td className="p-2">Taekwondo</td>
            <td className="p-2">Juegos Nacionales</td>
            <td className="p-2">Bogotá</td>
            <td className="p-2">INDIVIDUAL</td>

            <td className="p-2 flex gap-2">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                Editar
              </button>

              <button className="bg-red-600 text-white px-3 py-1 rounded">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}