import { object, string } from "yup";

const appointmentCreationValidation = object().shape({
  patient: string().required("Precisa informar um paciente."),
  doctor: string().required("Precisa informar um Médico."),
  date: string().required("Precisa informar um horário."),
});

export { appointmentCreationValidation };
