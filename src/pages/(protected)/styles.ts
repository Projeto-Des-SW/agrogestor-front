import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
