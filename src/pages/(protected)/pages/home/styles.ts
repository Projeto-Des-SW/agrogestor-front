import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const ActionsContainer = styled("div")({
  display: "flex",
  gap: "16px",
  marginTop: "8px",
  flexWrap: "wrap",
});

export const ActionCard = styled(Link)({
  flex: 1,
  minWidth: "200px",
  padding: "16px",
  border: "1px solid #eee",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#1E293B",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "all 0.2s ease-in-out",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
});
