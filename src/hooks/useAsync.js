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
        // Keep the last good data on a refetch failure (e.g. a transient error
        // during a locale switch) so the page shows stale content instead of
        // blanking. AsyncBoundary surfaces the error only when there is no data.
        if (active) setState((s) => ({ data: s.data, loading: false, error }));
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
