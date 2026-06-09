import MedalForm from "./MedalForm";

export default function MedalModal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-2xl font-bold mb-4">
          Nueva Medalla
        </h2>

        <MedalForm />
      </div>
    </div>
  );
}