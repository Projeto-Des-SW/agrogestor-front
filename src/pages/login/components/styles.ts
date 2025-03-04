import styled from 'styled-components';

export const InputContainer = styled.div`
    width: auto;
    height: auto;
    overflow: hidden;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #00141F; 
  font-size: 1rem;
  color: #00141F; 
  background-color:rgb(228, 230, 235); 

  &::placeholder {
    color: gray; 
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #003366; 
  }
`;
