import { PatientDTO } from "modules/patients";

import { ValidationError } from "yup";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";

import BaseRepository, { IRepositories } from "domain/repository";
import { TErrorMessage } from "components/error";

import { FilterAppointmentDTO, appointmentCreationValidation } from "./index";
import { AppointmentDTO } from "modules/appointments";
import { DoctorMUIDropDownListDTO } from "modules/users";

type AppointmentUseCaseReturn = {
  onSuccess: (
    appointment?: AppointmentDTO | AppointmentDTO[] | undefined
  ) => void;
  onError: (errors: TErrorMessage) => void;
};

type LoadAllPatientsUseCaseReturn = {
  onSuccess: (appointments: AppointmentDTO[]) => void;
  onError: (errors: TErrorMessage) => void;
};

export type TAppointmentUseCases = {
  create(
    patient: Partial<PatientDTO>,
    appointmentDoctor: DoctorMUIDropDownListDTO,
    appointmentDate: string,
    { onSuccess, onError }: AppointmentUseCaseReturn
  ): void;
  remove(
    appointment: AppointmentDTO,
    { onSuccess, onError }: AppointmentUseCaseReturn
  ): void;
  loadAll(
    filter: FilterAppointmentDTO,
    { onSuccess, onError }: LoadAllPatientsUseCaseReturn
  ): void;
};

export function create(
  patient: Partial<PatientDTO>,
  appointmentDoctor: DoctorMUIDropDownListDTO,
  appointmentDate: string,
  { onSuccess, onError }: AppointmentUseCaseReturn
) {
  const { appointments: appointmentRepository }: IRepositories =
    BaseRepository();

  const [date, fullhour] = new Date(appointmentDate).toISOString().split("T");
  const [hour, minute] = fullhour.split(":");

  const createAppointment = {
    patient: patient.id,
    doctor: appointmentDoctor.id,
    date: new Date(`${date}T${hour}:${minute}`),
  };

  appointmentCreationValidation
    .validate(createAppointment, { abortEarly: false })
    .then(() =>
      appointmentRepository
        .create(createAppointment)
        .then(() => {
          onSuccess();
        })
        .catch((errors: Error) =>
          onError({
            title: "Erro ao criar agendamento!",
            errors: errors.cause,
          })
        )
    )
    .catch((validationErrors: ValidationError) =>
      onError({
        title: "Erro ao criar o agendamento.",
        errors: mapperYupErrorsToErrorMessages(validationErrors),
      })
    );
}

export function remove(
  appointment: AppointmentDTO,
  { onSuccess, onError }: AppointmentUseCaseReturn
) {
  const { appointments: appointmentRepository }: IRepositories =
    BaseRepository();

  appointmentRepository
    .remove(appointment.id)
    .then(() => onSuccess())
    .catch((errors: Error) =>
      onError({
        title: "Erro ao excluir agendamento!",
        errors: errors.cause,
      })
    );
}

export function loadAll(
  filter: FilterAppointmentDTO,
  { onSuccess, onError }: LoadAllPatientsUseCaseReturn
) {
  const { appointments: appointmentRepository }: IRepositories =
    BaseRepository();

  appointmentRepository
    .getAll()
    .then((appointments: AppointmentDTO[]) => onSuccess(appointments))
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}
