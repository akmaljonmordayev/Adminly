import { Navigate } from "react-router-dom";
import React from "react";
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
