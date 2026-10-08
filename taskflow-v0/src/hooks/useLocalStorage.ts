import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initializer : on lit le localStorage UNE SEULE FOIS au montage
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // À chaque changement de `value`, on écrit dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage peut être indisponible (mode privé, quota dépassé…)
    }
  }, [key, value]);

  return [value, setValue] as const;
}