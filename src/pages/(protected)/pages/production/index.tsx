import {
  Box,
  Card,
  IconButton,
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
import { sum } from "lodash-es";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { ProductionLog } from "../../../../models/productionLog";
import {
  deleteProductionLog,
  getMembers,
  getProductionLogs,
} from "../../../../services/api";
import { formatCurrency } from "../../../../util/formatCurrency";
import * as S from "../styles";
import { Loading } from "../../../../components/Loading";

export default function Production() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [memberFilter, setMemberFilter] = useState<number>();
  const [groupFilter, setGroupFilter] = useState<number>();
  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();
  const queryClient = useQueryClient();
  const filters = {
    memberId: memberFilter,
    groupId: groupFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  };

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const { data: productionLogs, isLoading: productionLogsLoading } = useQuery<
    ProductionLog[]
  >({
    queryKey: ["productionLog", filters],
    queryFn: () => getProductionLogs(token!, filters),
  });

  const deleteLogMutation = useMutation({
    mutationFn: (id: number) => deleteProductionLog(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productionLog"] });
    },
  });

  const groups = Array.from(
    new Map(members?.map((member) => [member.group.id, member.group])).values(),
  );

  function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja excluir este registro de produção?")) {
      deleteLogMutation.mutate(id);
    }
  }
  if (membersLoading || productionLogsLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <S.Header>
        <h1>Produção</h1>
        <Button as={Link} to="new" variant="dark">
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
              sx={{ width: 200 }}
              size="small"
              onChange={(_, value) => setMemberFilter(value?.id)}
              getOptionLabel={(option) => option.name}
              options={[
                { name: "Todos os clientes", id: undefined },
                ...(members ?? []),
              ]}
              autoSelect
              disableClearable
              defaultValue={{ name: "Todos os clientes", id: undefined }}
              renderInput={(params) => (
                <TextField {...params} label="Filtrar clientes" />
              )}
            />
            <Autocomplete
              sx={{ width: 200 }}
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
                <TextField {...params} label="Filtrar grupos" />
              )}
            />
            <DatePicker
              sx={{ width: 200 }}
              label="Início"
              slotProps={{ textField: { size: "small" } }}
              onChange={(date) => setStartDateFilter(date?.toDate())}
            />
            <DatePicker
              sx={{ width: 200 }}
              label="Fim"
              slotProps={{ textField: { size: "small" } }}
              onChange={(date) => setEndDateFilter(date?.toDate())}
            />
          </S.Filters>
        </S.CardHeader>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Cliente</TableCell>
                <TableCell sx={{ width: "30%" }}>Data</TableCell>
                <TableCell sx={{ width: "30%" }}>Total</TableCell>
                <TableCell sx={{ width: "10%" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionLogs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.member.name}</TableCell>
                  <TableCell>{log.date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      sum(
                        log.productionEntries.map(
                          (entry) => entry.quantity * entry.price,
                        ),
                      ),
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/producao/edit/${log.id}`)}
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => handleDelete(log.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) ?? null}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </S.Container>
  );
}
