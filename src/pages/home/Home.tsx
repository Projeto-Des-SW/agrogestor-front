import { useState } from "react";
import { Navigate } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import Sales from "./views/Sales";
import Production from "./views/Production";
import * as S from "./styles";

const Home = () => {
  const [selectedPage, setSelectedPage] = useState("sales");
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const renderPage = () => {
    switch (selectedPage) {
      case "sales":
        return <Sales />;
      case "production":
        return <Production />;
      default:
        return <Sales />;
    }
  };

  return (
    <S.Container>
      <SideMenu selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <S.Content>{renderPage()}</S.Content>
    </S.Container>
  );
};

export default Home;