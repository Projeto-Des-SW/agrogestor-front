import {
  Box,
  Card,
  Typography,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getSales,
  getProductionLogs,
  getMembers,
  getGroups,
} from "../../../../services/api";
import { formatCurrency } from "../../../../util/formatCurrency";
import { useAuth } from "../../../../hooks/useAuth";
import { Group } from "../../../../models/group";
import { Member } from "../../../../models/member";
import { ProductionLog } from "../../../../models/productionLog";
import { Sale } from "../../../../models/sale";
import { DashboardCard } from "../../../../components/DashboardCard";
import { ShoppingCartIcon } from "lucide-react";
import { SummaryCard } from "../../../../components/SummaryCard";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router";

export default function Home() {
  const { token } = useAuth();
  const [tab, setTab] = useState(0);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const navigate = useNavigate();

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: () => getMembers(token!),
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => getGroups(token!),
  });

  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: () => getSales(token!, {}),
  });

  const { data: productionLogs = [] } = useQuery<ProductionLog[]>({
    queryKey: ["productionLogs"],
    queryFn: () => getProductionLogs(token!, {}),
  });

  const totalSales = sales
    .filter((sale) => {
      const date = new Date(sale.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce(
      (acc, sale) =>
        acc +
        sale.saleItems.reduce(
          (sum, item) => sum + item.quantity * item.productPrice.price,
          0,
        ),
      0,
    );

  const totalProduction = productionLogs
    .filter((log) => {
      const date = new Date(log.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce(
      (acc, log) =>
        acc +
        log.productionEntries.reduce(
          (sum, entry) => sum + entry.quantity * entry.price,
          0,
        ),
      0,
    );

  const dashboardCards = [
    {
      title: "Vendas",
      description: "Faturamento total do mês",
      buttonLabel: "Ver Vendas",
      color: "success",
      redirectTo: "/vendas",
    },
    {
      title: "Produção",
      description: "Total produzido até agora",
      buttonLabel: "Ver Produção",
      color: "warning",
      redirectTo: "/producao",
    },
    {
      title: "Clientes",
      description: "Clientes cadastrados na plataforma",
      buttonLabel: "Gerenciar clientes",
      color: "info",
      redirectTo: "/clientes",
    },
  ] as const;

  return (
    <Box sx={{ px: 10, mt: 5, width: "100%" }}>
      <Box sx={{ px: 3, maxWidth: "100%", width: "100%" }}>
        <Typography variant="h4" fontWeight="bold">
          Bem-vindo ao AgroGestor
        </Typography>
        <Typography variant="subtitle1" mb={4}>
          Gerencie sua produção agrícola e acompanhe seus resultados em um só
          lugar.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          px: 3,
        }}
      >
        <SummaryCard
          title="Vendas Totais"
          subtitle="Período: Mensal"
          value={formatCurrency(totalSales)}
          footer="Total de vendas no período"
          icon={<ShoppingCartIcon color="action" />}
          color="success"
        />
        <SummaryCard
          title="Produção Total"
          subtitle="Período: Mensal"
          value={formatCurrency(totalProduction)}
          footer="Produção total no período"
          icon={<AgricultureIcon color="action" />}
          color="warning"
        />
        <SummaryCard
          title="Clientes"
          subtitle="Clientes cadastrados"
          value={members.length.toString()}
          footer={`Em ${groups.length} grupos`}
          icon={<PeopleIcon color="action" />}
          color="info"
        />
      </Box>

      <Typography variant="h6" fontWeight="bold" px={3} mb={1}>
        O que deseja fazer?
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          px: 3,
        }}
      >
        {dashboardCards.map((card) => (
          <Box
            key={card.title}
            sx={{
              flex: "1 1 300px",
              minWidth: 280,
            }}
          >
            <DashboardCard {...card} />
          </Box>
        ))}
      </Box>

      <Box mb={2} px={3}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Vendas Recentes" />
          <Tab label="Produção Recente" />
        </Tabs>
      </Box>

      {tab === 0 ? (
        <Card sx={{ mb: 4, mx: 3, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Vendas Recentes
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.slice(0, 5).map((sale) => (
                <TableRow
                  key={sale.id}
                  onClick={() => navigate(`/vendas/edit/${sale.id}`)}
                  sx={{
                    cursor: "pointer",
                    ":hover": { backgroundColor: "#f8f8f8" },
                  }}
                > 
                  <TableCell>{sale.member.name}</TableCell>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      sale.saleItems.reduce(
                        (sum, item) =>
                          sum + item.quantity * item.productPrice.price,
                        0,
                      ),
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card sx={{ mb: 4, mx: 3, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Produção Recente
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionLogs.slice(0, 5).map((log) => (
                <TableRow
                  key={log.id}
                  onClick={() => navigate(`/producao/edit/${log.id}`)}
                  sx={{
                    cursor: "pointer",
                    ":hover": { backgroundColor: "#f8f8f8" },
                  }}
                >
                  <TableCell>{log.member.name}</TableCell>
                  <TableCell>
                    {new Date(log.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      log.productionEntries.reduce(
                        (sum, entry) => sum + entry.quantity * entry.price,
                        0,
                      ),
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
}
