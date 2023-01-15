import { useEffect, useRef } from 'react';

/**
 * Hook used to set intervals.
 * To cancel the interval, set delay to null.
 *
 * Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export const useInterval = (
  callback: () => void | Promise<void>,
  delay: number | null,
) => {
  const savedCallback = useRef<() => void | Promise<void>>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      if (savedCallback.current) {
        await savedCallback.current();
      }
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
