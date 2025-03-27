import { FaRegFileAlt } from "react-icons/fa";
import { LuMilk } from "react-icons/lu";
import { MdOutlineLogout } from "react-icons/md";
import * as S from "./styles";

export default function SideMenu() {
  return (
    <S.MenuContainer>
      <S.ContentContainer>
        <S.TitleContainer>
          <h1>Agrogestor</h1>
        </S.TitleContainer>
        <S.ItensContainer>
          <S.MenuItem to="/vendas">
            <FaRegFileAlt color="#1E293B" />
            <p>Vendas</p>
          </S.MenuItem>
          <S.MenuItem to="/producao">
            <LuMilk color="#1E293B" />
            <p>Produção</p>
          </S.MenuItem>
        </S.ItensContainer>
      </S.ContentContainer>
      <S.ButtonContainer>
        <S.LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <MdOutlineLogout />
          Logout
        </S.LogoutButton>
      </S.ButtonContainer>
    </S.MenuContainer>
  );
}
