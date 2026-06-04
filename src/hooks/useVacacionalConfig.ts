import { useEffect, useState } from "react";
import { obtenerConfigVacacional } from "@/services/vacacional.service";

/**
 * Hook que consulta el estado del formulario vacacional (GET /vacacionales/config).
 * - `activo`: true/false según la config del servidor. null mientras carga.
 * - `loading`: true durante la petición inicial.
 * - `refetch`: función para refrescar el estado manualmente.
 */
export function useVacacionalConfig() {
  const [activo, setActivo] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    obtenerConfigVacacional()
      .then((config) => setActivo(config.activo))
      .catch(() => setActivo(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  return { activo, loading, refetch: fetch };
}
