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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { sum } from "lodash-es";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useImmer } from "use-immer";
import Button from "../../../../../components/Button";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  getMembers,
  getProductPrice,
  getProducts,
  getSale,
  patchSale,
  postSale,
} from "../../../../../services/api";
import { formatCurrency } from "../../../../../util/formatCurrency";
import * as S from "../../styles";

export type NewSale = {
  memberName: string | null;
  date?: Date;
  items: {
    date: Date;
    quantity: number;
    price: number;
    productName: string;
    hasUserChangedPrice: boolean;
  }[];
};

export default function NewSale() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token!),
  });
  const { data: fetchedSale } = useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSale(token!, id!),
    enabled: !!id,
  });
  const [sale, setSale] = useImmer<NewSale>({
    memberName: null,
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
    mutationFn: (sale: NewSale) =>
      id ? patchSale(token!, id, sale) : postSale(token!, sale),
    onSettled: () => {
      navigate("/vendas");
    },
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
    if (fetchedSale)
      setSale({
        memberName: fetchedSale.member.name,
        date: fetchedSale.date,
        items: fetchedSale.saleItems.map((item) => ({
          date: item.productPrice.date,
          quantity: item.quantity,
          price: item.productPrice.price,
          productName: item.productPrice.product.name,
          hasUserChangedPrice: true,
        })),
      });
  }, [fetchedSale, setSale]);

  const saveDisabled =
    !sale.memberName ||
    !sale.items.length ||
    sale.items.some((e) => !e.productName || !e.quantity);

  return (
    <S.Container>
      <S.Header>
        <h1>Nova Venda</h1>
        <Button as={Link} to="/vendas" variant="dark">
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
            sx={{ width: "100%" }}
            size="small"
            onChange={(_, value) =>
              setSale((draft) => {
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
              <TextField {...params} label="Cliente" error={!sale.memberName} />
            )}
            value={sale.memberName}
          />
          <DatePicker
            label="Data"
            slotProps={{ textField: { size: "small" } }}
            onChange={(date) =>
              setSale((draft) => {
                draft.date = date?.toDate();
              })
            }
            value={dayjs(sale.date)}
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
                <TableCell sx={{ width: "20%" }}>
                  <DatePicker
                    label="Data"
                    sx={{ width: "100%" }}
                    slotProps={{ textField: { size: "small" } }}
                    onChange={(date) =>
                      setSale((draft) => {
                        draft.items[index].date = date!.toDate();
                        draft.items[index].hasUserChangedPrice = false;
                      })
                    }
                    defaultValue={dayjs(sale.items[index].date)}
                  />
                </TableCell>
                <TableCell sx={{ width: "60%" }}>
                  <Autocomplete
                    size="small"
                    onChange={(_, value) =>
                      setSale((draft) => {
                        draft.items[index].productName = value || "";
                        draft.items[index].hasUserChangedPrice = false;
                      })
                    }
                    options={products || []}
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
                        label="Produto"
                        error={!item.productName}
                      />
                    )}
                    value={item.productName || ""}
                  />
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <TextField
                    type="number"
                    size="small"
                    label="Quantidade"
                    value={item.quantity}
                    onChange={(event) => {
                      setSale((draft) => {
                        draft.items[index].quantity = Math.max(
                          0,
                          Number(event.target.value),
                        );
                      });
                    }}
                    onWheel={(event) => {
                      (event.target as HTMLInputElement).blur();
                    }}
                    error={!item.quantity}
                  />
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <TextField
                    type="number"
                    size="small"
                    label="Preço"
                    value={
                      item.hasUserChangedPrice
                        ? item.price
                        : productPrices[index]?.price || 0
                    }
                    onChange={(event) => {
                      setSale((draft) => {
                        draft.items[index].price = Math.max(
                          0,
                          Number(event.target.value),
                        );
                        draft.items[index].hasUserChangedPrice = true;
                      });
                    }}
                    onWheel={(event) => {
                      (event.target as HTMLInputElement).blur();
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 20 }}>
                  {formatCurrency(
                    (item.hasUserChangedPrice
                      ? item.price
                      : (productPrices[index]?.price ?? 0)) * item.quantity,
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() =>
                      setSale((draft) => {
                        draft.items = draft.items.filter((_, i) => i !== index);
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
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h2>
            Total:{" "}
            {formatCurrency(sum(sale.items.map((e) => e.price * e.quantity)))}
          </h2>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button variant="red" as={Link} to="/vendas">
              Cancelar
            </Button>
            <Button
              disabled={saveDisabled}
              onClick={() => submit(sale)}
              variant={saveDisabled ? "gray" : undefined}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </Card>
    </S.Container>
  );
}
