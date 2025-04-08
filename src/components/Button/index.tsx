import styled from "styled-components";

const Button = styled.button<{
  variant?: "ghost" | "dark" | "primary" | "gray" | "red";
  width?: number;
}>`
  background-color: ${({ variant }) =>
    variant === "ghost"
      ? "transparent"
      : variant === "dark"
        ? "#1e293b"
        : variant === "gray"
          ? "gray"
          : variant === "red"
            ? "#ef4444"
            : "#1d4ed8"};
  color: ${({ variant }) => (variant === "ghost" ? "#ef4444" : "#fff")};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  width: ${({ width }) => width}px;
  text-decoration: none;
  cursor: pointer;
`;

export default Button;
