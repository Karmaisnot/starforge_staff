import { useEffect, useState } from 'react';

/**
 * Run an async loader and track its lifecycle. Re-runs when `deps` change.
 * Guards against setting state after unmount / stale resolves.
 *
 * @param {() => Promise<any>} loader
 * @param {any[]} deps
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
