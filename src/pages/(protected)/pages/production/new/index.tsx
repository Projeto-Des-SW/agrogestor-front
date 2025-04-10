import {
  Autocomplete,
  Box,
  Card,
  createFilterOptions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { sum } from "lodash-es";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useImmer } from "use-immer";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import { ProductionLogPeriod } from "../../../../../models/productionEntry";
import {
  getMembers,
  getProductionLog,
  patchProductionLog,
  postProductionLog,
} from "../../../../../services/api";
import { formatCurrency } from "../../../../../util/formatCurrency";
import * as S from "../../styles";
import { Loading } from "../../../../../components/Loading";

export type NewProduction = {
  memberName: string | null;
  date?: Date;
  entries: {
    date: Date;
    quantity: number;
    price: number;
    period: ProductionLogPeriod;
  }[];
};

export default function NewProduction() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const { data: fetchedProduction, isLoading: productionLoading } = useQuery({
    queryKey: ["productionLog", id],
    queryFn: () => getProductionLog(token!, id!),
    enabled: !!id,
  });

  const [production, setProduction] = useImmer<NewProduction>({
    memberName: null,
    date: new Date(),
    entries: [],
  });
  const {
    mutate: submit,
    isPending: isSubmitting, 
  } = useMutation({
      mutationFn: (production: NewProduction) =>
      id
        ? patchProductionLog(token!, id, production)
        : postProductionLog(token!, production),
    onSettled: () => {
      navigate("/producao");
    },
  });

  useEffect(() => {
    if (fetchedProduction)
      setProduction({
        memberName: fetchedProduction.member.name,
        date: fetchedProduction.date,
        entries: fetchedProduction.productionEntries,
      });
  }, [fetchedProduction, setProduction]);

  const saveDisabled =
    !production.memberName ||
    !production.entries.length ||
    production.entries.some((e) => !e.quantity);

  if ((id && productionLoading) || membersLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <S.Header>
        <h1>Produção</h1>
        <Button as={Link} to="/producao" variant="dark">
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
        <S.Title>
          {id ? "Editar Registro de Produção" : "Novo Registro de Produção"}
        </S.Title>
        <S.MemberAndDate>
          <Autocomplete
            disabled={isSubmitting}
            sx={{ width: "100%" }}
            size="small"
            onChange={(_, value) =>
              setProduction((draft) => {
                draft.memberName = value || "";
              })
            }
            options={members?.map((member) => member.name) || []}
            filterOptions={(options, params) => {
              const filter = createFilterOptions<string>();
              const filtered = filter(options, params);

              const { inputValue } = params;

              const isExisting = options.some(
                (option) => inputValue === option,
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
            freeSolo
            autoSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                error={!production.memberName}
              />
            )}
            value={production.memberName}
          />
          <DatePicker
            disabled={isSubmitting}
            label="Data"
            slotProps={{ textField: { size: "small", disabled: isSubmitting } }}
            onChange={(date) =>
              setProduction((draft) => {
                draft.date = date?.toDate();
              })
            }
            value={dayjs(production.date)}
          />
        </S.MemberAndDate>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Data</TableCell>
              <TableCell sx={{ width: "10%" }}>Turno</TableCell>
              <TableCell sx={{ width: "30%" }}>Litros</TableCell>
              <TableCell sx={{ width: "30%" }}>Preço</TableCell>
              <TableCell>Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {production.entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <DatePicker
                    disabled={isSubmitting}
                    slotProps={{ textField: { size: "small", disabled: isSubmitting } }}
                    label="Data"
                    sx={{ width: "100%" }}
                    onChange={(date) =>
                      setProduction((draft) => {
                        draft.entries[index].date = date!.toDate();
                      })
                    }
                    defaultValue={dayjs(production.entries[index].date)}
                  />
                </TableCell>
                <TableCell>
                  <ToggleButtonGroup
                    disabled={isSubmitting}
                    onChange={(_, value) =>
                      setProduction((draft) => {
                        draft.entries[index].period =
                          value || draft.entries[index].period;
                      })
                    }
                    value={entry.period}
                    exclusive
                  >
                    <ToggleButton value={ProductionLogPeriod.MORNING}>
                      Manhã
                    </ToggleButton>
                    <ToggleButton value={ProductionLogPeriod.AFTERNOON}>
                      Tarde
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
                <TableCell>
                  <TextField
                    disabled={isSubmitting}
                    sx={{ width: "100%" }}
                    type="number"
                    size="small"
                    label="Litros"
                    value={entry.quantity}
                    onChange={(event) => {
                      setProduction((draft) => {
                        draft.entries[index].quantity = Math.max(
                          0,
                          Number(event.target.value),
                        );
                      });
                    }}
                    onWheel={(event) => {
                      (event.target as HTMLInputElement).blur();
                    }}
                    error={!entry.quantity}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    label="Preço"
                    value={entry.price}
                    onChange={(event) => {
                      setProduction((draft) => {
                        draft.entries[index].price = Math.max(
                          0,
                          Number(event.target.value),
                        );
                      });
                    }}
                    onWheel={(event) => {
                      (event.target as HTMLInputElement).blur();
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 20 }}>
                  {formatCurrency(entry.price * entry.quantity)}
                </TableCell>
                <TableCell>
                  <IconButton
                    sx={{ color: "red" }}
                    disabled={isSubmitting}
                    onClick={() =>
                      setProduction((draft) => {
                        draft.entries = draft.entries.filter(
                          (_, i) => i !== index,
                        );
                      })
                    }
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <Button
            disabled={isSubmitting}
            onClick={() =>
              setProduction((draft) => {
                draft.entries.push({
                  date: new Date(),
                  price: 0,
                  quantity: 0,
                  period: ProductionLogPeriod.MORNING,
                });
              })
            }
          >
            Adicionar entrada
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h2>
            Total:{" "}
            {formatCurrency(
              sum(production.entries.map((e) => e.price * e.quantity)),
            )}
          </h2>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button variant="red" as={Link} to="/producao" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              disabled={saveDisabled}
              onClick={() => submit(production)}
              variant={saveDisabled ? "gray" : undefined}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </Box>
        </Box>
      </Card>
    </S.Container>
  );
}
