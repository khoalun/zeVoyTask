import { useState, useCallback } from "react";

export function useBool() {
  const [value, setValue] = useState(false);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return { value, setTrue, setFalse, toggle, setValue };
}
