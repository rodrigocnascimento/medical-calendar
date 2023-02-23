import { serverEndpoint } from "../constants";
import BaseInfrastructure from "../infrastructure";
import { PatientRepository } from "../pages/patients/patient.repository";
import { UserRepository } from "../pages/users/user.repository";
import { AppointmentRepository } from "../pages/appointments/appointment.repository";
import { MedicalRegistryRepository } from "../pages/medical_registries/medical_registries.repository";

export interface IRepositories {
  patient: PatientRepository;
  user: UserRepository;
  appointments: AppointmentRepository;
  medicalRegistries: MedicalRegistryRepository;
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
  };
}
