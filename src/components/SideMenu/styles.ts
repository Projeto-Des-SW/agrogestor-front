import styled from "styled-components";

interface MenuItemProps {
  selected?: boolean;
}

export const ContentContainer = styled.div``;

export const MenuContainer = styled.div`
  width: 250px;
  background: #FFFFFF;
  border-right: 1px solid #ddd;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #E5E5E5;

  h1 {
    font-size: 1.25rem;
    color: #1E293B;
    padding: 1rem;
    margin: 0;
    width: 100%;
  }
`;

export const ItensContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.25rem;
  overflow: hidden;
`;

export const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 0.63rem 1rem;
  overflow: hidden;
  box-sizing: border-box;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#f5f5f5" : "transparent")};
  border-radius: 6px;

  p {
    width: 100%;
    margin: 0;
    color: #1e293b;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #E5E5E5;
  justify-content: flex-start;
  align-items: center;
`;

export const LogoutButton = styled.button`
  all: unset;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  color: red;
  background-color: #FFFFFF;
  padding: 0.63rem 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;
