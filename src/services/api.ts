import axios from "axios";
import { Group } from "../models/group";
import { Member } from "../models/member";
import { mapToProductionLog, ProductionLog } from "../models/productionLog";
import { ProductPrice } from "../models/productPrice";
import { mapToSale, Sale } from "../models/sale";
import { NewProduction } from "../pages/(protected)/pages/production/new";
import { NewSale } from "../pages/(protected)/pages/sales/new";
import { NewUser, User } from "../models/user";
import { NewMember } from "../pages/(protected)/pages/members/new";

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

export async function getMember(token: string, id: number | string) {
  return (
    await api.get(`members/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as Member & { group: Group };
}

export async function postMember(token: string, member: NewMember) {
  return api.post("members", member, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchMember(
  token: string,
  id: number | string,
  member: NewMember,
) {
  return api.patch(`members/${id}`, member, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteMember(token: string, id: number | string) {
  return api.delete(`members/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getGroups(token: string) {
  return (
    await api.get("groups", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as Group[];
}

export async function getSale(token: string, id: number | string) {
  return mapToSale(
    (
      await api.get(`sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data,
  );
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
  ).data.map(mapToSale) as Sale[];
}

export async function getProducts(token: string) {
  return (
    await api.get("products", { headers: { Authorization: `Bearer ${token}` } })
  ).data as string[];
}

export async function getProductPrice(
  token: string,
  params: { product: string; date: Date; memberName: string },
) {
  return (
    await api.get("prices", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
  ).data as ProductPrice;
}

export async function postSale(token: string, sale: NewSale) {
  return api.post("sales", sale, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchSale(
  token: string,
  id: number | string,
  sale: NewSale,
) {
  return api.patch(`sales/${id}`, sale, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getProductionLog(
  token: string,
  id: number | string,
): Promise<ProductionLog> {
  return mapToProductionLog(
    (
      await api.get(`productionLog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data,
  );
}

export async function getProductionLogs(
  token: string,
  params: {
    memberId?: number;
    startDate?: Date;
    endDate?: Date;
  },
): Promise<ProductionLog[]> {
  return (
    await api.get("productionLog", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
  ).data.map(mapToProductionLog);
}

export async function postProductionLog(token: string, log: NewProduction) {
  return api.post("productionLog", log, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchProductionLog(
  token: string,
  id: number | string,
  log: NewProduction,
) {
  return api.patch(`productionLog/${id}`, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteSale(token: string, id: number | string) {
  return api.delete(`sales/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteProductionLog(token: string, id: number | string) {
  return api.delete(`productionLog/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getUsers(token: string) {
  return (
    await api.get("users", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as User[];
}

export async function deleteUser(token: string, id: number | string) {
  return api.delete(`users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createUser(token: string, user: NewUser) {
  return (
    await api.post("users", user, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export async function updateUser(token: string, id: number, user: NewUser) {
  return (
    await api.patch(`users/${id}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export async function getUserById(token: string, id: number) {
  return (
    await api.get(`users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as User;
}
