import { AppointmentDTO } from "modules/appointments";

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
  extends Partial<
    Omit<PatientDTO, "id" | "createdAt" | "updatedAt" | "appointments">
  > {}
export interface UpdatePatientDTO
  extends Partial<
    Omit<PatientDTO, "createdAt" | "updatedAt" | "appointments">
  > {}

export interface FilterPatientDTO extends Partial<PatientDTO> {}
