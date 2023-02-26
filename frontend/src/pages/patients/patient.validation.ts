import { object, string, mixed, number } from "yup";
import { Genre } from "./index";

const patientValidation = object().shape({
  name: string().required("Nome é necessário."),
  email: string().email("Email inválido.").required("Email é obrigatório."),
  phone: string().required("Telefone é obrigatório."),
  height: number().test(
    "decimalDigits",
    "Altura é obrigatório. Ou valor é inválido.",
    (number) => /\d+\.?\d*/g.test(String(number))
  ),
  weight: number().test(
    "decimalDigits",
    "Peso é obrigatório. Ou valor é inválido.",
    (number) => /\d+\.?\d*/g.test(String(number))
  ),
  genre: mixed<Genre>()
    .oneOf(Object.values(Genre))
    .required("Precisa escolher o gênero do paciente."),
});

export { patientValidation };
