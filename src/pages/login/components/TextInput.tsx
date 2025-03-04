import * as S from "./styles";

interface TextInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <S.InputContainer>
      <S.Input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
      />
    </S.InputContainer>
  );
};
