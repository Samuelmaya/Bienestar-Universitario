import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "upc-perfil:";

export function useProfileData<T extends Record<string, string>>(
  section: string,
  userKey: string | undefined,
  defaults: T,
): [T, (field: keyof T, value: string) => void, () => void] {
  const storageKey = `${STORAGE_PREFIX}${userKey ?? "anon"}:${section}`;
  const [data, setData] = useState<T>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<T>;
        setData({ ...defaults, ...parsed });
      } else {
        setData(defaults);
      }
    } catch {
      setData(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const updateField = useCallback(
    (field: keyof T, value: string) => {
      setData((prev) => {
        const next = { ...prev, [field]: value };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setData(defaults);
  }, [storageKey, defaults]);

  return [data, updateField, reset];
}
