import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { login } from "../../services/authService";
import { useDispatch, userActions } from "../../store";
import * as S from "./styles";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, error } = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      const result = await login(
        data.get("username") as string,
        data.get("password") as string,
      );
      if (result.access_token) {
        dispatch(userActions.login(result.access_token as string));
        navigate("/");
      }
    },
  });

  function handleErrors(errorMessage: string) {
    if (errorMessage.includes("401")) return "Usuário ou senha incorretos";
  }

  return (
    <S.PageContainer>
      <S.LoginContainer>
        <S.Title>
          Agrogestor
          <span>#</span>
        </S.Title>
        <S.FormContainer onSubmit={mutate}>
          <TextInput type="text" name="username" placeholder="Usuário" />
          <TextInput type="password" name="password" placeholder="Senha" />
          <Button backgroundColor="#00141f" type="submit">
            Entrar
          </Button>
        </S.FormContainer>
        {error && <p style={{ color: "red" }}>{handleErrors(error.message)}</p>}
      </S.LoginContainer>
    </S.PageContainer>
  );
};

export default Login;
