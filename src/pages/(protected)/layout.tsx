import { Outlet } from "react-router";
import SideMenu from "../../components/SideMenu";
import * as S from "./styles";

export default function MainLayout() {
  return (
    <S.Container>
      <SideMenu />
      <Outlet />
    </S.Container>
  );
}
