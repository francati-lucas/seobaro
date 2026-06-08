import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  if (currentUser) return <>{children}</>;
  
  const params = new URLSearchParams(location.search || '');
  params.set('auth', 'required');
  return (
    <Navigate
      to={{
        pathname: '/',
        search: `?${params.toString()}`,
      }}
      state={{ from: location }}
      replace
    />
  );
}

