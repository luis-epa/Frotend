import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/autenticacion/inicioSesion" />;
  }

  // if (!user || (requiredRole && user.rol !== requiredRole)) {
  //   return <Navigate to={"/inicio"} />;
  // }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/inicio" />;
  }

  return children;
};

export default ProtectedRoute;
