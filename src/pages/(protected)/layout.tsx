import { Box } from "@mui/material";
import { Outlet } from "react-router";
import SideMenu from "../../components/SideMenu";
import * as S from "./styles";

export default function MainLayout() {
  return (
    <S.Container>
      <Box
        sx={{
          width: { xs: 0, sm: "250px" },
          display: { xs: "none", sm: "block" },
        }}
      >
        <SideMenu />
      </Box>
      <Outlet />
    </S.Container>
  );
}
