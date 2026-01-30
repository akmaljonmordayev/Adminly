import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Login tekshiruvi
  if (!token || !user) {
    return <Navigate to="/auth/signin" replace />;
  }

  // 2. Role tekshiruvi
  if (role && user.role !== role) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
