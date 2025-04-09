import {
  Autocomplete,
  Box,
  Card,
  createFilterOptions,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useImmer } from "use-immer";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import { Group } from "../../../../../models/group";
import {
  getGroups,
  getMember,
  patchMember,
  postMember,
} from "../../../../../services/api";
import * as S from "../../styles";

export interface NewMember {
  name: string;
  groupName: string | null;
}

export default function NewMember() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const [member, setMember] = useImmer<NewMember>({
    name: "",
    groupName: null,
  });

  const { data: fetchedMember } = useQuery({
    queryKey: ["members", id],
    queryFn: () => getMember(token!, id!),
    enabled: isEdit,
  });

  const { data: groups } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => getGroups(token!),
  });

  useEffect(() => {
    if (fetchedMember) {
      setMember({
        name: fetchedMember.name,
        groupName: fetchedMember.group.name,
      });
    }
  }, [fetchedMember, setMember]);

  const { mutate: submit } = useMutation({
    mutationFn: () =>
      isEdit ? patchMember(token!, id!, member) : postMember(token!, member),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/clientes");
    },
  });

  const saveDisabled = !member.name || !member.groupName;

  return (
    <S.Container>
      <S.Header>
        <h1>{isEdit ? "Editar Cliente" : "Novo Cliente"}</h1>
        <Button as={Link} to="/clientes" variant="dark">
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
        <S.Title>{isEdit ? "Editar Cliente" : "Criar Cliente"}</S.Title>
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <TextField
            label="Nome"
            size="small"
            fullWidth
            value={member.name}
            onChange={(e) =>
              setMember((draft) => {
                draft.name = e.target.value;
              })
            }
            error={!member.name}
          />
          <Autocomplete
            fullWidth
            size="small"
            onChange={(_, value) =>
              setMember((draft) => {
                draft.groupName = value;
              })
            }
            options={groups?.map((e) => e.name) || []}
            filterOptions={(options, params) => {
              const filter = createFilterOptions<string>();
              const filtered = filter(options, params);

              const { inputValue } = params;

              const isExisting = options.some(
                (option) => inputValue === option
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
            autoSelect
            freeSolo
            value={member.groupName}
            renderInput={(params) => (
              <TextField {...params} label="Grupo" error={!member.groupName} />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="red" as={Link} to="/clientes">
            Cancelar
          </Button>
          <Button
            onClick={() => submit()}
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
