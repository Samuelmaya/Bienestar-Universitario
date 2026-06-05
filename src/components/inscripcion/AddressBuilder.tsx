import { useState, useEffect } from "react";

// ─── Opciones de tipo de vía ──────────────────────────────────────────────────
const TIPOS_VIA = [
  "AVENIDA",
  "AVENIDA CALLE",
  "AVENIDA CARRERA",
  "CALLE",
  "CARRERA",
  "CIRCULAR",
  "CIRCUNVALAR",
  "DIAGONAL",
  "MANZANA",
  "TRANSVERSAL",
  "VÍA",
  "AUTOPISTA",
  "KILOMETRO",
];

// ─── Conectores / separadores entre partes de la dirección ──────────────────
const SEPARADORES = ["#", "BIS", "BIS #", "S/N"];

// ─── Opciones de complemento ─────────────────────────────────────────────────
const COMPLEMENTOS = [
  "APTO",
  "APARTAMENTO",
  "BLOQUE",
  "BODEGA",
  "CASA",
  "EDIFICIO",
  "INTERIOR",
  "LOCAL",
  "LOTE",
  "MANZANA",
  "OFICINA",
  "PISO",
  "TORRE",
  "UNIDAD",
  "URBANIZACIÓN",
];

interface AddressBuilderProps {
  /** Valor actual como string concatenado */
  value: string;
  onChange: (direccion: string) => void;
  label?: string;
  required?: boolean;
  hasError?: boolean;
  bgClass?: string;
}

interface AddressParts {
  tipoVia: string;
  numeroVia: string;
  separador: string;
  numeroCruce: string;
  complementoTipo: string;
  complementoNum: string;
}

/** Construye el string final de dirección */
function buildAddress(p: AddressParts): string {
  if (!p.numeroVia) return "";
  let dir = `${p.tipoVia} ${p.numeroVia}`;
  if (p.numeroCruce) {
    dir += ` ${p.separador} ${p.numeroCruce}`;
  }
  if (p.complementoTipo && p.complementoNum) {
    dir += ` ${p.complementoTipo} ${p.complementoNum}`;
  } else if (p.complementoTipo) {
    dir += ` ${p.complementoTipo}`;
  }
  return dir.trim();
}

export function AddressBuilder({
  value,
  onChange,
  label,
  required = false,
  hasError = false,
  bgClass = "bg-muted",
}: AddressBuilderProps) {
  const [parts, setParts] = useState<AddressParts>({
    tipoVia: "CALLE",
    numeroVia: "",
    separador: "#",
    numeroCruce: "",
    complementoTipo: "",
    complementoNum: "",
  });

  // Si el valor externo se limpia (reset), limpiar partes también
  useEffect(() => {
    if (!value) {
      setParts({
        tipoVia: "CALLE",
        numeroVia: "",
        separador: "#",
        numeroCruce: "",
        complementoTipo: "",
        complementoNum: "",
      });
    }
  }, [value]);

  const update = (field: keyof AddressParts, val: string) => {
    const next = { ...parts, [field]: val };
    setParts(next);
    onChange(buildAddress(next));
  };

  const baseInput = `w-full px-3 py-2 border-2 rounded-lg text-foreground text-sm outline-none transition-all ${bgClass}`;
  const borderOk = "border-secondary/30 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";
  const borderErr = "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200";
  const border = hasError && !parts.numeroVia ? borderErr : borderOk;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold text-primary uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Fila 1: tipo de vía + número/nombre de la vía */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Tipo de vía
          </label>
          <select
            value={parts.tipoVia}
            onChange={(e) => update("tipoVia", e.target.value)}
            className={`${baseInput} ${borderOk}`}
          >
            {TIPOS_VIA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Número / nombre
          </label>
          <input
            type="text"
            placeholder="Ej: 12, 12A, 12-B"
            value={parts.numeroVia}
            onChange={(e) => update("numeroVia", e.target.value)}
            className={`${baseInput} ${border}`}
          />
        </div>
      </div>

      {/* Fila 2: separador + número de cruce */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Conector
          </label>
          <select
            value={parts.separador}
            onChange={(e) => update("separador", e.target.value)}
            className={`${baseInput} ${borderOk}`}
          >
            {SEPARADORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            N° cruce / distancia
          </label>
          <input
            type="text"
            placeholder="Ej: 34-56, 78"
            value={parts.numeroCruce}
            onChange={(e) => update("numeroCruce", e.target.value)}
            className={`${baseInput} ${borderOk}`}
          />
        </div>
      </div>

      {/* Fila 3: complemento (opcional) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Complemento <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <select
            value={parts.complementoTipo}
            onChange={(e) => update("complementoTipo", e.target.value)}
            className={`${baseInput} ${borderOk}`}
          >
            <option value="">— Ninguno —</option>
            {COMPLEMENTOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {parts.complementoTipo && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Número / detalle
            </label>
            <input
              type="text"
              placeholder="Ej: 301, B, 2"
              value={parts.complementoNum}
              onChange={(e) => update("complementoNum", e.target.value)}
              className={`${baseInput} ${borderOk}`}
            />
          </div>
        )}
      </div>

      {/* Preview de la dirección construida */}
      {value && (
        <div className="rounded-lg px-3 py-2 bg-primary/5 border border-primary/20 text-xs font-medium text-primary">
          📬 {value}
        </div>
      )}
    </div>
  );
}
