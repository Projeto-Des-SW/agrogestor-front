import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import {
  deleteProductionLog,
  getMembers,
  getProductionLogs,
} from "../../../../services/api";
import { formatCurrency } from "../../../../util/formatCurrency";
import * as S from "../styles";
import { Trash2 } from "lucide-react";
import { ProductionLog } from "../../../../models/productionLog";

export default function Production() {
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

  const groups = Array.from(
    new Map(members?.map((member) => [member.group.id, member.group])).values()
  );

  const { data: productionLogs } = useQuery<ProductionLog[]>({
    queryKey: ["productionLogs", filters],
    queryFn: () => getProductionLogs(token!, filters),
  });

  const queryClient = useQueryClient();

  const deleteLogMutation = useMutation({
    mutationFn: (id: number) => deleteProductionLog(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productionLogs", filters] });
    },
  });

  function handleDeleteLog(id: number) {
    if (confirm("Tem certeza que deseja excluir este registro de produção?")) {
      deleteLogMutation.mutate(id);
    }
  }

  return (
    <S.Container>
      <S.Header>
        <h1>Produção</h1>
        <Button as={Link} to="new">
          Novo Registro
        </Button>
      </S.Header>

      <Card
        sx={{
          padding: "25px",
          gap: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <S.CardHeader>
          <S.Title>Registros de Produção</S.Title>
          <S.Filters>
            <Autocomplete
              sx={{ width: 300 }}
              size="small"
              onChange={(_, value) => setMemberFilter(value?.id)}
              getOptionLabel={(option) => option.name}
              options={[
                { name: "Todos os membros", id: undefined },
                ...(members ?? []),
              ]}
              autoSelect
              disableClearable
              defaultValue={{ name: "Todos os membros", id: undefined }}
              renderInput={(params) => (
                <TextField
                  sx={{ border: "none" }}
                  {...params}
                  label="Filtrar membros"
                />
              )}
            />
            <Autocomplete
              sx={{ width: 300 }}
              size="small"
              onChange={(_, value) => setGroupFilter(value?.id)}
              getOptionLabel={(option) => option.name}
              options={[
                { name: "Todos os grupos", id: undefined },
                ...(groups ?? []),
              ]}
              autoSelect
              disableClearable
              defaultValue={{ name: "Todos os grupos", id: undefined }}
              renderInput={(params) => (
                <TextField
                  sx={{ border: "none" }}
                  {...params}
                  label="Filtrar grupos"
                />
              )}
            />
            <DatePicker
              label="Início"
              slotProps={{ textField: { size: "small" } }}
              onChange={(date) => setStartDateFilter(date?.toDate())}
            />
            <DatePicker
              label="Fim"
              slotProps={{ textField: { size: "small" } }}
              onChange={(date) => setEndDateFilter(date?.toDate())}
            />
          </S.Filters>
        </S.CardHeader>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Membro</TableCell>
              <TableCell>Turno</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productionLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{log.member.name}</TableCell>
                <TableCell>{log.shift}</TableCell>
                <TableCell>{log.quantity}</TableCell>
                <TableCell>{formatCurrency(log.quantity * 30)}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDeleteLog(log.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            )) ?? null}
          </TableBody>
        </Table>
      </Card>
    </S.Container>
  );
}
