"use client";
import { useRef, useCallback, useEffect } from "react";

export function useDebounce<A extends unknown[]>(
  fn: (...args: A) => void | Promise<void>,
  delay = 1000,
): (...args: A) => Promise<void> {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resolvePending = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      resolvePending.current?.();
    },
    [],
  );

  return useCallback(
    (...args: A) => {
      clearTimeout(timer.current);
      resolvePending.current?.();

      return new Promise<void>((resolve, reject) => {
        resolvePending.current = resolve;
        timer.current = setTimeout(() => {
          resolvePending.current = null;
          timer.current = undefined;
          Promise.resolve()
            .then(() => fn(...args))
            .then(resolve, reject);
        }, delay);
      });
    },
    [fn, delay],
  );
}
