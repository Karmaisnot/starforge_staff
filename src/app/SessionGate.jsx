import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isApiMode } from '@/data/http/apiConfig.js';
import { getToken, subscribeToSession } from '@/data/http/authToken.js';

/** Keeps live API routes behind a persisted session while mock mode stays frictionless. */
export function SessionGate() {
  const [hasSession, setHasSession] = useState(() => Boolean(getToken()));
  const location = useLocation();

  useEffect(() => subscribeToSession(() => setHasSession(Boolean(getToken()))), []);

  if (!isApiMode()) return <Outlet />;
  if (!hasSession) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
