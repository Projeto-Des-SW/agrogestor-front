import { useState } from "react";
import { login } from "../../services/authService";
import * as S from "./styles";
import { TextInput } from "./components/TextInput";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(username, password);

    if (result) {
      alert("Login realizado com sucesso!");
    } else {
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <S.PageContainer>
      <S.BackgroundImage />
      <S.LoginContainer>
        <S.TitleContainer>
          <S.Title>Agrogestor</S.Title>
          <S.Logo src="src/assets/logo.svg" />
        </S.TitleContainer>
        <S.FormContainer onSubmit={handleLogin}>
          <TextInput
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </S.FormContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </S.LoginContainer>
    </S.PageContainer>
  );
};

export default Login;
