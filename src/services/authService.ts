import axios from "axios";
import { API_BASE_URL } from "../config";

export const login = async (username: string, password: string) => {
  return (
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    })
  ).data;
};
