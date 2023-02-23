import { serverEndpoint } from "../constants";
import BaseInfrastructure from "../infrastructure";
import { PatientRepository } from "../pages/patients/patient.repository";
import { UserRepository } from "../pages/users/user.repository";
import { AppointmentRepository } from "../pages/appointments/appointment.repository";

export interface IRepositories {
  patient: PatientRepository;
  user: UserRepository;
  appointments: AppointmentRepository;
}

export default function BaseRepository(): IRepositories {
  const infra = BaseInfrastructure();

  return {
    patient: new PatientRepository(
      serverEndpoint,
      infra.http,
      infra.storage.token
    ),

    user: new UserRepository(serverEndpoint, infra.http, infra.storage.token),

    appointments: new AppointmentRepository(
      serverEndpoint,
      infra.http,
      infra.storage.token
    ),
  };
}
