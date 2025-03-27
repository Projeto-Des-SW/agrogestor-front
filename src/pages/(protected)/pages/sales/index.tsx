import { useQuery } from "@tanstack/react-query";
import { sum } from "lodash-es";
import { Badge, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { getGroups, getMembers, getSales } from "../../../../services/api";
import { formatCurrency } from "../../../../util/formatCurrency";
import * as S from "../styles";

export default function Sales() {
  const { token } = useAuth();
  const [memberFilter, setMemberFilter] = useState<number>();
  const [groupFilter, setGroupFilter] = useState<number>();
  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();
  const filters = {
    memberId: memberFilter,
    groupId: groupFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  };
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(token!),
  });
  const { data: sales } = useQuery({
    queryKey: ["sales", filters],
    queryFn: () => getSales(token!, filters),
  });

  return (
    <S.Container>
      <S.Header>
        <h1>Vendas</h1>
        <Button as={Link} to="new">
          Nova Venda
        </Button>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.Title>Vendas</S.Title>
          <S.Filters>
            <select
              onChange={(e) =>
                setMemberFilter(
                  e.target.value === "all" ? undefined : Number(e.target.value),
                )
              }
            >
              <option value="all">Todos os clientes</option>
              {members?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              )) ?? null}
            </select>
            <select
              onChange={({ target: { value } }) =>
                setGroupFilter(value === "all" ? undefined : Number(value))
              }
            >
              <option value="all">Todos os grupos</option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              )) ?? null}
            </select>
            <input
              type="date"
              onChange={({ target: { value } }) =>
                setStartDateFilter(value === "" ? undefined : new Date(value))
              }
            />
            <input
              type="date"
              onChange={({ target: { value } }) =>
                setEndDateFilter(value === "" ? undefined : new Date(value))
              }
            />
          </S.Filters>
        </S.CardHeader>
        <S.Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th className="right">Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales?.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.date.toLocaleDateString()}</td>
                <td>{sale.member.name}</td>
                <td>
                  <Badge>Leite (10)</Badge>
                </td>
                <td className="right">
                  {formatCurrency(
                    sum(
                      sale.saleItems.map(
                        (item) =>
                          item.quantity * Number(item.productPrice.price),
                      ),
                    ),
                  )}
                </td>
                <td>
                  <Button variant="ghost">
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            )) ?? null}
          </tbody>
        </S.Table>
      </S.Card>
    </S.Container>
  );
}
