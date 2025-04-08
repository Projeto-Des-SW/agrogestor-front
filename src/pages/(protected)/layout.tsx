import { Box } from "@mui/material";
import { Outlet } from "react-router";
import SideMenu from "../../components/SideMenu";
import * as S from "./styles";

export default function MainLayout() {
  return (
    <S.Container>
      <Box sx={{ width: "250px" }}>
        <SideMenu />
      </Box>
      <Outlet />
    </S.Container>
  );
}
