import { serverEndpoint } from "env-constants";
import BaseInfrastructure from "infrastructure";
import { IPatientRepository, PatientRepository } from "modules/patients";
import { IUserRepository, UserRepository } from "modules/users";
import {
  AppointmentRepository,
  IAppointmentRepository,
} from "modules/appointments";
import {
  IMedicalRegistryRepository,
  MedicalRegistryRepository,
} from "modules/medical_registries";
import { AuthRepository, IAuthRepository } from "modules/auth";

export interface IRepositories {
  patient: IPatientRepository;
  user: IUserRepository;
  appointments: IAppointmentRepository;
  medicalRegistries: IMedicalRegistryRepository;
  auth: IAuthRepository;
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

    medicalRegistries: new MedicalRegistryRepository(
      serverEndpoint,
      infra.http,
      infra.storage.token
    ),

    auth: new AuthRepository(serverEndpoint, infra.http, infra.storage.token),
  };
}
