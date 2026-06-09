export default function MedalForm() {
  return (
    <form className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Disciplina"
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Evento"
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Ciudad"
        className="border p-2 rounded"
      />

      <select className="border p-2 rounded">
        <option>INDIVIDUAL</option>
        <option>GRUPAL</option>
      </select>

      <button className="bg-blue-600 text-white p-2 rounded">
        Guardar
      </button>
    </form>
  );
}