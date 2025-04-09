import {
  Box,
  Card,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useImmer } from "use-immer";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import type { NewUser as NewUserType } from "../../../../../models/user";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../../../../services/api";
import * as S from "../../../pages/styles";

export default function NewUser() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = !!id;

  const { data: userData } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(token!, Number(id)),
    enabled: editing,
  });

  const [user, setUser] = useImmer<NewUserType>({
    name: "",
    username: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name,
        username: userData.username,
        role: userData.role,
      });
    }
  }, [userData, setUser]);

  const { mutate: submit } = useMutation({
    mutationFn: (user: NewUserType) => {
      const payload = { ...user };
      if (editing) {
        delete payload.password;
      }
      return editing
        ? updateUser(token!, Number(id), payload)
        : createUser(token!, payload);
    },
    onSettled: () => navigate("/usuarios"),
  });

  const disabled =
    !user.name || !user.username || (!editing && !user.password) || !user.role;

  return (
    <S.Container>
      <S.Header>
        <h1>{editing ? "Editar Usuário" : "Novo Usuário"}</h1>
        <Button as={Link} to="/usuarios" variant="dark">
          Voltar
        </Button>
      </S.Header>

      <Card
        sx={{
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <S.Title>Adicionar Usuário</S.Title>

        <Box sx={{ display: "flex", gap: "16px" }}>
          <TextField
            fullWidth
            label="Nome"
            placeholder="Digite o nome do usuário"
            size="small"
            value={user.name}
            onChange={(e) =>
              setUser((draft) => {
                draft.name = e.target.value;
              })
            }
          />
          <TextField
            fullWidth
            label="Usuário"
            placeholder="Digite o usuário"
            size="small"
            value={user.username}
            onChange={(e) =>
              setUser((draft) => {
                draft.username = e.target.value;
              })
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: "16px" }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Senha"
              placeholder={"Digite a senha"}
              size="small"
              type="password"
              disabled={editing}
              value={editing ? "************" : user.password}
              onChange={(e) => {
                if (!editing) {
                  setUser((draft) => {
                    draft.password = e.target.value;
                  });
                }
              }}
            />
          </Box>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <ToggleButtonGroup
              exclusive
              value={user.role}
              onChange={(_, value) =>
                setUser((draft) => {
                  if (value) draft.role = value;
                })
              }
              size="small"
            >
              <ToggleButton value="USER">Usuário</ToggleButton>
              <ToggleButton value="ADMIN">Administrador</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <Button variant="red" as={Link} to="/usuarios">
            Cancelar
          </Button>
          <Button
            disabled={disabled}
            onClick={() => submit(user)}
            variant={disabled ? "gray" : undefined}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </S.Container>
  );
}
