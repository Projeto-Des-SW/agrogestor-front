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
      draft.memberName = members?.[0].name;
    });
  }, [members, setSale]);

  console.log(sale);
  return (
    <S.Container>
      <S.Header>
        <h1>Nova Venda</h1>
        <Button as={Link} to="/vendas">
          Voltar
        </Button>
      </S.Header>
      <S.Card>
        <S.Title>Nova Venda</S.Title>
        <S.MemberAndDate>
          <select
            onChange={({ target: { value } }) =>
              setSale((draft) => {
                draft.memberName = value;
              })
            }
            value={sale.memberName}
          >
            {members?.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            )) ?? null}
          </select>
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
        <S.Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index}>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
                  {formatCurrency(
                    (item.hasUserChangedPrice
                      ? item.price
                      : (productPrices[index]?.price ?? 0)) * item.quantity,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </S.Table>
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
      </S.Card>
    </S.Container>
  );
}
