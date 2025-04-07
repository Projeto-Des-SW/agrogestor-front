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
    background-color: #1e293b;
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
`;

export const MemberAndDate = styled.div`
  display: flex;
  justify-content: stretch;
`;
