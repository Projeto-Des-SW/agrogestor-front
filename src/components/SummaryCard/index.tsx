import { Box, Card, Typography } from "@mui/material";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  value: string;
  footer?: string;
  icon?: ReactNode;
  color?: "success" | "warning" | "info";
}

const colorMap = {
  success: {
    background: "#e8f5e9",
    border: "#2e7d32",
  },
  warning: {
    background: "#fff3e0",
    border: "#ef6c00",
  },
  info: {
    background: "#e3f2fd",
    border: "#1565c0",
  },
};

export function SummaryCard({
  title,
  subtitle,
  value,
  footer,
  icon,
  color,
}: SummaryCardProps) {
  const styles = color ? colorMap[color] : undefined;

  return (
    <Card
      sx={{
        p: 2,
        flex: 1,
        minWidth: 250,
        backgroundColor: styles?.background,
        borderLeft: styles ? `4px solid ${styles.border}` : undefined,
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={styles?.border ?? "inherit"}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Box>{icon}</Box>
      </Box>

      <Typography variant="h5" fontWeight="bold" mt={2}>
        {value}
      </Typography>

      {footer && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {footer}
        </Typography>
      )}
    </Card>
  );
}
