import {
  Autocomplete,
  Card,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  getMembers,
  postProductionLog,
} from "../../../../../services/api";
import * as S from "../../styles";

interface Member {
  id: number;
  name: string;
}

export type ProductionLogFormState = {
  date: Date;
  memberName: string;
  period: "MORNING" | "AFTERNOON" | "NIGHT";
  quantity: number;
  price: number;
};

export default function NewProduction() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: members } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const [log, setLog] = useState<ProductionLogFormState>({
    date: new Date(),
    memberName: "",
    period: "MORNING",
    quantity: 0,
    price: 0,
  });

  const { mutate: submit } = useMutation({
    mutationFn: (log: ProductionLogFormState) =>
      postProductionLog(token!, {
        date: log.date, 
        memberName: log.memberName,
        entries: [
          {
            date: log.date, 
            quantity: log.quantity,
            price: log.price,
            period: log.period,
          },
        ],
      }),
    onSuccess: () => navigate("/producao"),
  });
  

  return (
    <S.Container>
      <S.Header>
        <h1>Novo Registro de Produção</h1>
        <Button as={Link} to="/producao">
          Voltar
        </Button>
      </S.Header>

      <Card
        sx={{
          padding: "25px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
          maxWidth: 500,
        }}
      >
        <S.Title>Novo Registro</S.Title>

        <Autocomplete
          sx={{ width: "100%" }}
          size="small"
          onChange={(_, value: Member | null) =>
            setLog((prev) => ({
              ...prev,
              memberName: value?.name ?? "",
            }))
          }
          getOptionLabel={(option) => option.name}
          options={members ?? []}
          renderInput={(params) => (
            <TextField {...params} label="Membro" />
          )}
        />

        <TextField
          label="Data"
          size="small"
          type="date"
          value={log.date.toISOString().split("T")[0]}
          onChange={(e) =>
            setLog((prev) => ({
              ...prev,
              date: new Date(e.target.value),
            }))
          }
        />

        <TextField
          label="Período"
          size="small"
          select
          value={log.period}
          onChange={(e) =>
            setLog((prev) => ({
              ...prev,
              period: e.target.value as "MORNING" | "AFTERNOON" | "NIGHT",
            }))
          }
        >
          <MenuItem value="MORNING">Manhã</MenuItem>
          <MenuItem value="AFTERNOON">Tarde</MenuItem>
          <MenuItem value="NIGHT">Noite</MenuItem>
        </TextField>

        <TextField
          label="Quantidade"
          size="small"
          type="number"
          value={log.quantity}
          onChange={(e) =>
            setLog((prev) => ({
              ...prev,
              quantity: Number(e.target.value),
            }))
          }
        />

        <TextField
          label="Preço unitário"
          size="small"
          type="number"
          value={log.price}
          onChange={(e) =>
            setLog((prev) => ({
              ...prev,
              price: Number(e.target.value),
            }))
          }
        />

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button as={Link} to="/producao">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!log.memberName) return alert("Selecione um membro.");
              if (log.quantity <= 0) return alert("Informe uma quantidade válida.");
              if (log.price <= 0) return alert("Informe um preço válido.");
              submit(log);
            }}
          >
            Salvar
          </Button>
        </div>
      </Card>
    </S.Container>
  );
}
