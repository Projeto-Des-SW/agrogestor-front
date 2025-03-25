import { lighten, readableColor } from "polished";
import styled from "styled-components";

const Button = styled.button<{ backgroundColor: string }>`
  all: unset;
  text-align: center;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => readableColor(props.backgroundColor)};
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  transition: all 50ms;

  &:hover {
    background-color: ${(props) => lighten(0.05)(props.backgroundColor)};
  }

  &:active {
    background-color: ${(props) => lighten(0.1)(props.backgroundColor)};
  }
`;

export default Button;
