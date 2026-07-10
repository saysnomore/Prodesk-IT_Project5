import { useEffect, useState } from "react";

/**
 * Behaves like useState, but the value is read from localStorage on init
 * and written back on every change — this is what gives the board its
 * "survives a hard refresh" requirement (Phase 2: State Persistence).
 */
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.warn(`Could not read localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Could not write localStorage key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
