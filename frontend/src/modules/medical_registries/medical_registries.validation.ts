import { object, string } from "yup";

const medicalRegistriesValidation = object().shape({
  observation: string().required("Precisa informar uma observação!"),
  medicalAppointment: string().required("Precisa informar um agendamento!"),
});

export { medicalRegistriesValidation };
