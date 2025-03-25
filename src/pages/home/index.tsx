import { useState } from "react";
import SideMenu from "../../components/SideMenu";
import * as S from "./styles";
import Production from "./views/Production";
import Sales from "./views/Sales";

const Home = () => {
  const [selectedPage, setSelectedPage] = useState("sales");

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
