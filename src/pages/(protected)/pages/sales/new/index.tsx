import {
  Autocomplete,
  Card,
  createFilterOptions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { sum } from "lodash-es";
import { useEffect } from "react";
import { Link } from "react-router";
import { useImmer } from "use-immer";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  getMembers,
  getProductPrice,
  getProducts,
  postSale,
} from "../../../../../services/api";
import { formatCurrency } from "../../../../../util/formatCurrency";
import * as S from "../../styles";

export type NewSale = {
  memberName?: string;
  date?: Date;
  items: {
    date: Date;
    quantity: number;
    price: number;
    productName: string;
    hasUserChangedPrice: boolean;
  }[];
};

const filter =
  createFilterOptions<Awaited<ReturnType<typeof getMembers>>[number]>();

export default function NewSale() {
  const { token } = useAuth();
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token!),
  });
  const [sale, setSale] = useImmer<NewSale>({
    memberName: undefined,
    date: new Date(),
    items: [],
  });
  const productPrices = useQueries({
    queries: sale.items.map((item) => ({
      queryKey: [
        "productPrice",
        {
          product: item.productName,
          date: item.date,
          memberName: sale.memberName,
        },
      ],
      queryFn: () =>
        getProductPrice(token!, {
          product: item.productName,
          date: item.date,
          memberName: sale.memberName ?? "",
        }),
    })),
  }).map((e) => e.data);
  const { mutate: submit } = useMutation({
    mutationFn: (sale: NewSale) => postSale(token!, sale),
  });

  useEffect(() => {
    setSale((draft) => {
      for (let i = 0; i < draft.items.length; i++) {
        if (!draft.items[i].hasUserChangedPrice)
          draft.items[i].price = productPrices[i]?.price ?? 0;
      }
    });
  }, [productPrices, setSale]);

  useEffect(() => {
    setSale((draft) => {
      draft.memberName = members?.[0]?.name;
    });
  }, [members, setSale]);

  return (
    <S.Container>
      <S.Header>
        <h1>Nova Venda</h1>
        <Button as={Link} to="/vendas">
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
        <S.Title>Nova Venda</S.Title>
        <S.MemberAndDate>
          <Autocomplete
            sx={{ width: 300 }}
            size="small"
            onChange={(_, value) =>
              setSale((draft) => {
                draft.memberName =
                  typeof value === "string" ? value : value?.name;
              })
            }
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            options={members ?? []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;

              const isExisting = options.some(
                (option) => inputValue === option.name,
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  id: 0,
                  disabled: false,
                  groupId: 0,
                  name: inputValue,
                  group: {
                    disabled: false,
                    id: 0,
                    name: "",
                  },
                });
              }
              return filtered;
            }}
            autoSelect
            freeSolo
            renderInput={(params) => (
              <TextField sx={{ border: "none" }} {...params} label="Membro" />
            )}
          />
          <input
            type="date"
            value={sale.date?.toISOString().split("T")[0]}
            onChange={({ target: { value } }) =>
              setSale((draft) => {
                draft.date = value === "" ? undefined : new Date(value);
              })
            }
          />
        </S.MemberAndDate>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Preço Unit.</TableCell>
              <TableCell>Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sale.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <input
                    onChange={({ target: { value } }) =>
                      setSale((draft) => {
                        draft.items[index].date = new Date(value);
                        draft.items[index].hasUserChangedPrice = false;
                      })
                    }
                    type="date"
                    value={item.date.toISOString().split("T")[0]}
                  />
                </TableCell>
                <TableCell>
                  <select
                    onChange={({ target: { value } }) =>
                      setSale((draft) => {
                        draft.items[index].productName = value;
                        draft.items[index].hasUserChangedPrice = false;
                      })
                    }
                  >
                    {products?.map((product) => (
                      <option key={product}>{product}</option>
                    )) ?? null}
                  </select>
                </TableCell>
                <TableCell>
                  <input
                    onChange={({ target: { value } }) =>
                      setSale((draft) => {
                        draft.items[index].quantity = Number(value);
                      })
                    }
                    type="number"
                    value={item.quantity}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    onChange={({ target: { value } }) =>
                      setSale((draft) => {
                        draft.items[index].price = Number(value || 0);
                        draft.items[index].hasUserChangedPrice = true;
                      })
                    }
                    value={
                      item.hasUserChangedPrice
                        ? item.price.toString()
                        : (productPrices[index]?.price.toString() ?? "0")
                    }
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    (item.hasUserChangedPrice
                      ? item.price
                      : (productPrices[index]?.price ?? 0)) * item.quantity,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={() =>
            setSale((draft) => {
              draft.items.push({
                date: new Date(),
                price: 0,
                productName: products?.[0] ?? "",
                quantity: 0,
                hasUserChangedPrice: false,
              });
            })
          }
        >
          Adicionar item
        </Button>
        <h2>
          Total:{" "}
          {formatCurrency(sum(sale.items.map((e) => e.price * e.quantity)))}
        </h2>
        <Button as={Link} to="/vendas">
          Cancelar
        </Button>
        <Button onClick={() => submit(sale)}>Salvar</Button>
      </Card>
    </S.Container>
  );
}
