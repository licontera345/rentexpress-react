import { useCallback, useState } from 'react';

/**
 * Booleano on/off para modales, dropdowns, acordeones, etc.
 */
export function useToggle(initial = false) {
  const [on, setOn] = useState(Boolean(initial));

  const open = useCallback(() => setOn(true), []);
  const close = useCallback(() => setOn(false), []);
  const toggle = useCallback(() => setOn((prev) => !prev), []);

  return { on, open, close, toggle, setOn };
}

export default useToggle;
