import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    return (
      <Navigate
        to='/'
        replace={true}
      />
    );
  }
  return children;
};

export default ProtectedRoute;
