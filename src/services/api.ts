import axios from "axios";
import { Group } from "../models/group";
import { Member } from "../models/member";
import { mapToSale, Sale } from "../models/sale";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export async function login(username: string, password: string) {
  return (await api.post("auth/login", { username, password })).data
    .access_token as string;
}

export async function getMembers(token: string) {
  return (
    await api.get("members", { headers: { Authorization: `Bearer ${token}` } })
  ).data as (Member & { group: Group })[];
}

export async function getGroups(token: string) {
  return (
    await api.get("groups", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as Group[];
}

export async function getSales(
  token: string,
  params: {
    memberId?: number;
    groupId?: number;
    startDate?: Date;
    endDate?: Date;
  },
) {
  return (
    await api.get("sales", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
  ).data.map((e: Sale) => mapToSale(e)) as Sale[];
}
