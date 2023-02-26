import { ref, object, string, mixed } from "yup";
import { UserRoles } from "./index";

const userValidation = object().shape({
  name: string().required("Nome é necessário."),
  email: string().email("Email inválido.").required("Email is required"),
  password: string().required("Senha é obrigatória."),
  passwordConfirmation: string().oneOf([ref("password"), ""], "Senhas devem ser iguais"),
  role: mixed<UserRoles>()
    .oneOf(Object.values(UserRoles))
    .required("Precisa escolher um tipo de usuário."),
});

export { userValidation };
