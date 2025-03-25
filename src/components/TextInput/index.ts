import styled from "styled-components";

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #00141f;
  font-size: 1rem;
  color: #00141f;
  background-color: rgb(228, 230, 235);

  &::placeholder {
    color: gray;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #036;
  }
`;

export default TextInput;
