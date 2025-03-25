import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background: url("/src/assets/images/agro.jpg") no-repeat center center;
  background-size: cover;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1;
  padding: 4rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-family: Roboto, sans-serif;
  font-weight: bold;
  display: flex;
  gap: 0.5rem;
  color: #354446;
  align-items: center;

  span {
    color: #ffd658;
    font-size: 2rem;
    font-weight: 900;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
`;
