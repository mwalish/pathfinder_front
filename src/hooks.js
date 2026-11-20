import { useEffect, useState } from 'react';
import { isCancel } from './api';

// Runs fetcher(signal) when deps change; stale requests are aborted.
export function useApi(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: '' }));
    fetcher(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((e) => { if (!isCancel(e)) setState({ data: null, loading: false, error: e.message }); });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export function useDebounce(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
