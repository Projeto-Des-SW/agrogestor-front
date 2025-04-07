import { LuFileText, LuLogOut, LuMilk } from "react-icons/lu";
import { Link } from "react-router";
import { useAppDispatch, userActions } from "../../store";
import * as S from "./styles";

export default function SideMenu() {
  const dispatch = useAppDispatch();
  return (
    <S.MenuContainer>
      <S.ContentContainer>
        <S.TitleContainer>
          <Link to="/">AgroGestor</Link>
        </S.TitleContainer>
        <S.ItensContainer>
          <S.MenuItem to="/vendas">
            <LuFileText color="#1E293B" />
            Vendas
          </S.MenuItem>
          <S.MenuItem to="/producao">
            <LuMilk color="#1E293B" />
            Produção
          </S.MenuItem>
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
