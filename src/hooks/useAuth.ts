import { useAppSelector } from "../store";

export function useAuth() {
  const user = useAppSelector((state) => state.user);

  return {
    ...user,
    isAuthenticated: !!user.token,
  };
}
