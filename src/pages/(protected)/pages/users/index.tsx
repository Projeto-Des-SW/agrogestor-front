import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { getUsers, deleteUser } from "../../../../services/api";
import * as S from "../styles";
import { User } from "../../../../models/user";
import { useState } from "react";

export default function Users() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(token!),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  return (
    <S.Container>
      <S.Header>
        <h1>Gerenciar Usuários</h1>
        <Button as="a" href="/usuarios/new" variant="dark">
          Novo usuário
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
          <S.Title>Usuários Cadastrados</S.Title>
          <TextField
            size="small"
            placeholder="Buscar usuários..."
            sx={{ width: 300 }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </S.CardHeader>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/usuarios/edit/${user.id}`)}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </S.Container>
  );
}
