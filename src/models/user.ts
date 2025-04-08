export interface User {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "USER";
}

export type NewUser = {
  name: string;
  username: string;
  password?: string;
  role: "ADMIN" | "USER";
};
