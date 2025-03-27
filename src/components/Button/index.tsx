import styled from "styled-components";

const Button = styled.button<{ variant?: "ghost" }>`
  background-color: ${({ variant }) =>
    variant === "ghost" ? "transparent" : "#1d4ed8"};
  color: ${({ variant }) => (variant === "ghost" ? "#ef4444" : "#fff")};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
`;

export default Button;
