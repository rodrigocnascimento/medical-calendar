import { IRepositories } from "../../domain/repository";
import { AppointmentDTO } from "../appointments/appointment.dto";

/**
 * List of human genres
 * @readonly
 * @enum M Male
 * @enum F Female
 **/
export enum Genre {
  M = "M",
  F = "F",
}

export interface PatientDTO {
  id: string;
  name: string;
  email: string;
  dob: Date;
  phone: string;
  height: number;
  weight: number;
  genre: Genre;
  createdAt: Date;
  appointments: AppointmentDTO[];
}

export interface CreatePatientDTO
  extends Partial<Omit<PatientDTO, "createdAt" | "updatedAt" | "appointments">> {}
export interface UpdatePatientDTO
  extends Partial<Omit<PatientDTO, "createdAt" | "updatedAt" | "appointments">> {}

export type PatientsComponentProps = {
  repository: Pick<IRepositories, "patient" | "appointments" | "user">;
};

export interface FilterPatientDTO extends Partial<PatientDTO> {}
