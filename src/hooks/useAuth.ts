import { useAppSelector } from "../store";

export function useAuth() {
  const token = useAppSelector((state) => state.user.token);

  return {
    token,
    isAuthenticated: !!token,
  };
}
