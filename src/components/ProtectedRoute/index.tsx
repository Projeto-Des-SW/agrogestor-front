import { Navigate, Outlet } from "react-router";
import { useSelector } from "../../store";

const ProtectedRoute = () => {
  const token = useSelector((state) => state.user.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
