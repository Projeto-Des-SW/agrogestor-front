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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { deleteMember, getGroups, getMembers } from "../../../../services/api";
import * as S from "../styles";
import { Loading } from "../../../../components/Loading";

export default function Members() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [memberFilter, setMemberFilter] = useState<number>();
  const [groupFilter, setGroupFilter] = useState<number>();
  const queryClient = useQueryClient();

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteMutation.mutate(id);
    }
  };

  if (membersLoading || groupsLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <S.Header>
        <h1>Gerenciar Clientes</h1>
        <Button as={Link} to="new" variant="dark">
          Novo Cliente
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
          <S.Title>Clientes Cadastrados</S.Title>
          <S.Filters>
            <Autocomplete
              sx={{ width: 250 }}
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
              sx={{ width: 250 }}
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
              <TableCell sx={{ width: "45%" }}>Nome</TableCell>
              <TableCell sx={{ width: "45%" }}>Grupo</TableCell>
              <TableCell sx={{ width: "10%" }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.group.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`edit/${member.id}`)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 size={16} />
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
