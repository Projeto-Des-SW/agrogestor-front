import { format } from "date-fns";
import { Badge, CalendarIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/Button/Button";
import { formatCurrency } from "../../../util/formatCurrency";
import { Input } from "../../login/components/styles";
import * as S from "./styles";

export default function Sales() {
  const [date, setDate] = useState<Date>();

  return (
    <S.Container>
      <S.Header>
        <h1>Notas de Venda</h1>
        <Button>Nova Nota</Button>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.Title>Notas de Venda</S.Title>
          <S.Filters>
            <Input placeholder="Buscar notas..." />
            <select>
              <option value="all">Todos os clientes</option>
              <option value="joao">João Silva</option>
              <option value="maria">Maria Oliveira</option>
            </select>
            <S.DateButton onClick={() => setDate(new Date())}>
              <CalendarIcon />
              {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
            </S.DateButton>
          </S.Filters>
        </S.CardHeader>

        <S.Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th className="right">Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12/03/2024</td>
              <td>João Silva</td>
              <td>
                <Badge>Leite (10)</Badge>
              </td>
              <td className="right">{formatCurrency(600)}</td>
              <td>
                <Button variant="ghost">
                  <Trash2 />
                </Button>
              </td>
            </tr>
          </tbody>
        </S.Table>
      </S.Card>
    </S.Container>
  );
}
