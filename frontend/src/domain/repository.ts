import { PatientRepository } from "../pages/patients/patient.repository";
import { UserRepository } from "../pages/users/user.repository";
import { serverEndpoint } from "../constants";
import BaseInfrastructure from "../infrastructure";

export interface IRepositories {
  patient: PatientRepository;
  user: UserRepository;
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
  };
}
