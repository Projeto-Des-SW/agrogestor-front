import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
