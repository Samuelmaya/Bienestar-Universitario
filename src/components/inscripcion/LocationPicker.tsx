import { useState, useEffect } from "react";
import { COLOMBIA } from "@/shared/data/colombia";

interface LocationPickerProps {
  /** Valor actual — formato "Municipio, Departamento" */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  /** Si true, aplica borde rojo cuando el campo está vacío y se intentó avanzar */
  hasError?: boolean;
  /** Clases de fondo del select (para diferenciar contextos, ej. bg-muted vs bg-white) */
  bgClass?: string;
}

/** Extrae departamento y ciudad del valor concatenado "Ciudad, Departamento" */
function parsearValor(val: string): { dpto: string; ciudad: string } {
  if (!val) return { dpto: COLOMBIA[0].departamento, ciudad: COLOMBIA[0].ciudades[0] };
  const partes = val.split(", ");
  if (partes.length >= 2) {
    const ciudad = partes[0];
    const dpto = partes.slice(1).join(", ");
    const dptoObj = COLOMBIA.find((d) => d.departamento === dpto);
    if (dptoObj && dptoObj.ciudades.includes(ciudad)) {
      return { dpto, ciudad };
    }
  }
  return { dpto: COLOMBIA[0].departamento, ciudad: COLOMBIA[0].ciudades[0] };
}

export function LocationPicker({
  value,
  onChange,
  label,
  required = false,
  hasError = false,
  bgClass = "bg-muted",
}: LocationPickerProps) {
  const inicial = parsearValor(value);
  const [dpto, setDpto] = useState(inicial.dpto);
  const [ciudad, setCiudad] = useState(inicial.ciudad);

  const dptoObj = COLOMBIA.find((d) => d.departamento === dpto) ?? COLOMBIA[0];
  const ciudades = dptoObj.ciudades;

  // Sincroniza si el valor externo cambia (ej. reset del formulario)
  useEffect(() => {
    const p = parsearValor(value);
    setDpto(p.dpto);
    setCiudad(p.ciudad);
  }, [value]);

  const handleDpto = (nuevoDpto: string) => {
    setDpto(nuevoDpto);
    const obj = COLOMBIA.find((d) => d.departamento === nuevoDpto) ?? COLOMBIA[0];
    const primeraCiudad = obj.ciudades[0];
    setCiudad(primeraCiudad);
    onChange(`${primeraCiudad}, ${nuevoDpto}`);
  };

  const handleCiudad = (nuevaCiudad: string) => {
    setCiudad(nuevaCiudad);
    onChange(`${nuevaCiudad}, ${dpto}`);
  };

  const baseSelect = `w-full px-3 py-2 border-2 rounded-lg text-foreground outline-none transition-all ${bgClass}`;
  const borderClass = hasError
    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
    : "border-secondary/30 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold text-primary uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Departamento
          </label>
          <select
            value={dpto}
            onChange={(e) => handleDpto(e.target.value)}
            className={`${baseSelect} ${borderClass}`}
          >
            {COLOMBIA.map((d) => (
              <option key={d.id} value={d.departamento}>
                {d.departamento}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Municipio / Ciudad
          </label>
          <select
            value={ciudad}
            onChange={(e) => handleCiudad(e.target.value)}
            className={`${baseSelect} ${borderClass}`}
          >
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground pl-0.5">
          📍 {value}
        </p>
      )}
    </div>
  );
}
