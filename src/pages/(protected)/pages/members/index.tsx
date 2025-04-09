import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../../hooks/useAuth";
import * as S from "../styles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMember, getGroups, getMembers } from "../../../../services/api";
import Button from "../../../../components/Button";
import {
  Autocomplete,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { useMemo, useState } from "react";

export default function Members() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [memberFilter, setMemberFilter] = useState<number>();
  const [groupFilter, setGroupFilter] = useState<number>();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(token!),
  });

  const filteredMembers = useMemo(() => {
    return members?.filter((member) => {
      const matchesMember =
        memberFilter === undefined || member.id === memberFilter;
      const matchesGroup =
        groupFilter === undefined || member.group.id === groupFilter;
      return matchesMember && matchesGroup;
    });
  }, [members, memberFilter, groupFilter]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMember(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: any) => {
      alert("Erro ao excluir membro: " + error?.response?.data?.message || error.message);
    },
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este membro?"
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <h1>Gerenciar Membros</h1>
        <Button as={Link} to="new" variant="dark">
          Novo Membro
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
          <S.Title>Membros Cadastrados</S.Title>
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
                <TextField {...params} label="Filtrar membros" />
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
                <TextField {...params} label="Filtrar grupos" />
              )}
            />
          </S.Filters>
        </S.CardHeader>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers?.map((member) => (
              <TableRow
                key={member.id}
                sx={{
                  cursor: "pointer",
                  ":hover": { backgroundColor: "#f8f8f8" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`edit/${member.id}`, { state: { member } });
                }}
              >
                <TableCell sx={{ width: "50%" }}>{member.name}</TableCell>
                <TableCell sx={{ width: "50%" }}>{member.group.name}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 1,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    sx={{ color: "dodgerblue" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`edit/${member.id}`, { state: { member } });
                    }}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) ?? null}
          </TableBody>
        </Table>
      </Card>
    </S.Container>
  );
}
