import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({
  adminOnly,
  redirect = "/login",
}: {
  adminOnly?: boolean;
  redirect?: string;
}) {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && (!adminOnly || role === "ADMIN") ? (
    <Outlet />
  ) : (
    <Navigate to={redirect} />
  );
}
