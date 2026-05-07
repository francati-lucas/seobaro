import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthed } from './PedidoAccessModal';

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (isAuthed()) return <>{children}</>;
  const params = new URLSearchParams(location.search || '');
  params.set('auth', 'required');
  return (
    <Navigate
      to={{
        pathname: '/',
        search: `?${params.toString()}`,
      }}
      replace
    />
  );
}

