import styled from 'styled-components';

export const PageContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
`;

export const BackgroundImage = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('/src/assets/image 1.svg') no-repeat center center;
    background-size: cover;
    z-index: -1; 
`;

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.5rem;
    width: 40%; 
    height: 100vh; 
    background: rgba(255, 255, 255, 0.8); 
    backdrop-filter: blur(10px); 
    z-index: 1; 
    padding: 2rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;

export const Title = styled.h1`
    font-size: 1.5rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    color: #354446;
`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    width: 70%;
`;

export const Logo = styled.img`
    width: 2.5rem;
    height: 2.5rem;
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: .75rem;
    justify-content: center;
    align-items: center;
`;