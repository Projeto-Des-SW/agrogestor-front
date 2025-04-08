import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  padding: 32px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
  }

  a {
    text-decoration: none;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;

export const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MemberAndDate = styled.div`
  display: flex;
  justify-content: stretch;
  gap: 20px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

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
