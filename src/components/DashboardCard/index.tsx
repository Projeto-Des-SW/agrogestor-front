import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupIcon from "@mui/icons-material/Group";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export type DashboardCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  color: "success" | "warning" | "info";
  redirectTo: string;
};

const colorMap: Record<
  DashboardCardProps["color"],
  {
    border: string;
    background: string;
    button: "success" | "warning" | "info"; // Tipagem exata
    icon: React.ReactNode;
  }
> = {
  success: {
    border: "#2e7d32",
    background: "#e8f5e9",
    button: "success",
    icon: <ShoppingCartIcon />,
  },
  warning: {
    border: "#ef6c00",
    background: "#fff3e0",
    button: "warning",
    icon: <LocalDrinkIcon />,
  },
  info: {
    border: "#1565c0",
    background: "#e3f2fd",
    button: "info",
    icon: <GroupIcon />,
  },
};

export function DashboardCard({
  title,
  description,
  buttonLabel,
  color,
  redirectTo,
}: DashboardCardProps) {
  const styles = colorMap[color];
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        p: 2,
        borderLeft: `4px solid ${styles.border}`,
        backgroundColor: styles.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color={styles.border}>
          {title}
        </Typography>
        <Typography variant="body2" mb={2}>
          {description}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color={styles.button}
        endIcon={<ArrowForwardIcon />}
        startIcon={styles.icon}
        fullWidth
        onClick={() => navigate(redirectTo)}
      >
        {buttonLabel.toUpperCase()}
      </Button>
    </Card>
  );
}
