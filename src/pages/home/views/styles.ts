import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background-color: #f8fafc;
  padding: 2rem;
  box-sizing: border-box;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  button {
    background-color: #0f172a;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    transition: 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.875rem;
    width: 250px;
  }

  select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.875rem;
    background-color: #fff;
    width: 180px;
  }
`;

export const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #fff;
  width: 180px;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f1f5f9;
  }

  th,
  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    border-top: 1px solid #e2e8f0;
  }

  th {
    text-align: left;
    font-weight: 600;
  }

  td {
    vertical-align: middle;
  }

  .right {
    text-align: right;
    font-weight: 500;
  }

  .badge-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .trash-button {
    background: transparent;
    border: none;
    cursor: pointer;

    svg {
      color: #ef4444;
    }
  }
`;
