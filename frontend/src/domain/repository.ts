import { serverEndpoint } from "../constants";
import BaseInfrastructure from "../infrastructure";
import { IPatientRepository, PatientRepository } from "../pages/patients/patient.repository";
import { IUserRepository, UserRepository } from "../pages/users/user.repository";
import {
  AppointmentRepository,
  IAppointmentRepository,
} from "../pages/appointments/appointment.repository";
import {
  IMedicalRegistryRepository,
  MedicalRegistryRepository,
} from "../pages/medical_registries/medical_registries.repository";

export interface IRepositories {
  patient: IPatientRepository;
  user: IUserRepository;
  appointments: IAppointmentRepository;
  medicalRegistries: IMedicalRegistryRepository;
}

export default function BaseRepository(): IRepositories {
  const infra = BaseInfrastructure();

  return {
    patient: new PatientRepository(serverEndpoint, infra.http, infra.storage.token),

    user: new UserRepository(serverEndpoint, infra.http, infra.storage.token),

    appointments: new AppointmentRepository(serverEndpoint, infra.http, infra.storage.token),

    medicalRegistries: new MedicalRegistryRepository(
      serverEndpoint,
      infra.http,
      infra.storage.token
    ),
  };
}
