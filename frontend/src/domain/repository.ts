import { serverEndpoint } from "env-constants";
import BaseInfrastructure from "infrastructure";
import { IPatientRepository, PatientRepository } from "pages/patients";
import { IUserRepository, UserRepository } from "pages/users";
import { AppointmentRepository, IAppointmentRepository } from "pages/appointments";
import { IMedicalRegistryRepository, MedicalRegistryRepository } from "pages/medical_registries";

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
