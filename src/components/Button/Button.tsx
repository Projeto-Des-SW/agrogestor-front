import styled from "styled-components"

type Props = {
  children: React.ReactNode
  variant?: "default" | "ghost"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, variant = "default", ...props }: Props) {
  return <StyledButton $variant={variant} {...props}>{children}</StyledButton>
}

const StyledButton = styled.button<{ $variant: string }>`
  background-color: ${({ $variant }) => ($variant === "ghost" ? "transparent" : "#1d4ed8")};
  color: ${({ $variant }) => ($variant === "ghost" ? "#ef4444" : "#fff")};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
`
