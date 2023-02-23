import { PatientRepository } from "../pages/patients/patient.repository";
import { serverEndpoint } from "../constants";
import BaseInfrastructure from "../infrastructure";

export interface IRepositories {
  patient: PatientRepository;
}

export default function BaseRepository(): IRepositories {
  const infra = BaseInfrastructure();

  return {
    patient: new PatientRepository(
      serverEndpoint,
      infra.http,
      infra.storage.token
    ),
  };
}
