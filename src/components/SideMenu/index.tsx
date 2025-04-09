import {
  LuFileText,
  LuLayoutDashboard,
  LuLeaf,
  LuLogOut,
  LuMilk,
  LuUser,
} from "react-icons/lu";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch, userActions } from "../../store";
import * as S from "./styles";

export default function SideMenu() {
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  return (
    <S.MenuContainer>
      <S.ContentContainer>
        <S.TitleContainer>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <LuLeaf size={24} color="#10B981" />
            <span
              style={{
                fontWeight: "bold",
                color: "#10B981",
                fontSize: "1.1rem",
              }}
            >
              AgroGestor
            </span>
          </Link>
        </S.TitleContainer>

        <S.ItensContainer>
          <S.MenuItem to="/">
            <LuLayoutDashboard color="#1E293B" />
            Dashboard
          </S.MenuItem>
          <S.MenuItem to="/vendas">
            <LuFileText color="#1E293B" />
            Vendas
          </S.MenuItem>
          <S.MenuItem to="/producao">
            <LuMilk color="#1E293B" />
            Produção
          </S.MenuItem>
          {role === "ADMIN" && (
            <S.MenuItem to="/usuarios">
              <LuUser color="#1E293B" />
              Usuários
            </S.MenuItem>
          )}
        </S.ItensContainer>
      </S.ContentContainer>
      <S.LogoutButton
        onClick={() => {
          dispatch(userActions.logout());
        }}
      >
        <LuLogOut />
        Logout
      </S.LogoutButton>
    </S.MenuContainer>
  );
}
