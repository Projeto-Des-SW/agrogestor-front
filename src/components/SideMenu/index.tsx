import * as S from "./styles";
import { FaRegFileAlt } from "react-icons/fa";
import { LuMilk } from "react-icons/lu";
import { MdOutlineLogout } from "react-icons/md";

interface SideMenuProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  selectedPage,
  setSelectedPage,
}) => {
  return (
    <S.MenuContainer>
      <S.ContentContainer>
        <S.TitleContainer>
          <h1>Agrogestor</h1>
        </S.TitleContainer>
        <S.ItensContainer>
          <S.MenuItem
            onClick={() => setSelectedPage("sales")}
            selected={selectedPage === "sales"}
          >
            <FaRegFileAlt color="#1E293B" />
            <p>Vendas</p>
          </S.MenuItem>
          <S.MenuItem
            onClick={() => setSelectedPage("production")}
            selected={selectedPage === "production"}
          >
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
};

export default SideMenu;
