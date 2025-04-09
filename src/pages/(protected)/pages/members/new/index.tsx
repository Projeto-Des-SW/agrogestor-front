import { useEffect, useState } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  Box,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGroups,
  postMember,
  patchMember,
} from "../../../../../services/api";
import { Group } from "../../../../../models/group";
import { Member } from "../../../../../models/member";
import Button from "../../../../../components/Button";
import * as S from "../../styles";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../../../../../hooks/useAuth";

export default function NewMember() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const memberFromState: Member | undefined = location.state?.member;

  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [groupId, setGroupId] = useState<number | "">("");

  const { data: groups } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => getGroups(token!),
  });

  useEffect(() => {
    if (isEdit && memberFromState) {
      setName(memberFromState.name);
      setDisabled(memberFromState.disabled);
      setGroupId(memberFromState.groupId);
    }
  }, [isEdit, memberFromState]);

  const createMember = useMutation({
    mutationFn: (newMember: { name: string; groupName: string }) =>
      postMember(token!, newMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/membros");
    },
  });

  const updateMember = useMutation({
    mutationFn: (updated: { id: number; name: string; groupName: string }) =>
      patchMember(token!, updated.id, {
        name: updated.name,
        groupName: updated.groupName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/membros");
    },
  });

  const handleSubmit = () => {
    if (!name || groupId === "") return;

    const selectedGroup = groups?.find((g) => g.id === groupId);

    console.log(selectedGroup?.id)

    if (!selectedGroup) return;

    const payload = {
      name,
      groupName: selectedGroup.name,
    };

    if (isEdit && memberFromState) {
      updateMember.mutate({ id: memberFromState.id, ...payload });
    } else {
      createMember.mutate(payload);
    }
  };

  const saveDisabled = isEdit
    ? !name ||
      groupId === "" ||
      (name === memberFromState?.name &&
        disabled === memberFromState?.disabled &&
        groupId === memberFromState?.groupId)
    : !name || groupId === "";

  return (
    <S.Container>
      <S.Header>
        <h1>{isEdit ? "Editar Membro" : "Novo Membro"}</h1>
        <Button as={Link} to="/membros" variant="dark">
          Voltar
        </Button>
      </S.Header>
      <Card
        sx={{
          padding: "25px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <S.Title>{isEdit ? "Editar Membro" : "Criar Membro"}</S.Title>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Nome"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
            }
            label="Desativado"
          />
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel id="group-select-label">Grupo</InputLabel>
          <Select
            labelId="group-select-label"
            value={groupId}
            label="Grupo"
            onChange={(e) => setGroupId(e.target.value as number)}
            required
          >
            {Array.isArray(groups) ? (
              groups
                .filter((group) => !group.disabled)
                .map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))
            ) : (
              <MenuItem disabled>Erro ao carregar grupos</MenuItem>
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="red" as={Link} to="/membros">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saveDisabled}
            variant={saveDisabled ? "gray" : undefined}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </S.Container>
  );
}
