import styled from "styled-components";
import { NavLink } from "react-router";

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuContainer = styled.div`
  width: 250px;
  font-size: 14px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TitleContainer = styled.div`
  display: flex;
  height: 70px;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;

  a {
    color: #001420;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    padding: 15px;
    margin: 0;
    width: 100%;
  }
`;

export const ItensContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 4px;
`;

export const MenuItem = styled(NavLink)`
  display: flex;
  font-weight: 600;
  align-items: center;
  gap: 16px;
  padding: 15px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
  color: #001420;

  &.active {
    background: #ededeb;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

export const LogoutButton = styled.button`
  all: unset;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  background-color: #fff;
  height: 70px;
  padding: 0 30px;
  border-top: 1px solid #e5e5e5;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;
