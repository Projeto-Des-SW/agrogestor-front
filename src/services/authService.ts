import axios from "axios";
import { API_BASE_URL } from "../config";

interface LoginResponse {
  access_token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
