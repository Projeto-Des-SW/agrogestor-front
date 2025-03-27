import { useMutation } from "@tanstack/react-query";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { login } from "../../services/api";
import { useAppDispatch, userActions } from "../../store";
import * as S from "./styles";

export default function Login() {
  const dispatch = useAppDispatch();

  const { mutate, error } = useMutation({
    mutationFn: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      return login(
        data.get("username") as string,
        data.get("password") as string,
      );
    },
    onSuccess: (data) => dispatch(userActions.login(data)),
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
          <Button>Entrar</Button>
        </S.FormContainer>
        {error && <p style={{ color: "red" }}>{handleErrors(error.message)}</p>}
      </S.LoginContainer>
    </S.PageContainer>
  );
}
