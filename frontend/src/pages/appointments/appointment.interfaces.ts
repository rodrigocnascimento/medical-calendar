import { MedicallRegistriesDTO } from "pages/medical_registries";

export interface AppointmentDTO {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  patient: any;
  doctor: any;
  medicalRegistries: MedicallRegistriesDTO[];
}

export interface CreateAppointmentDTO
  extends Partial<Omit<AppointmentDTO, "createdAt" | "updatedAt">> {}

export interface UpdateAppointmentDTO
  extends Partial<Omit<AppointmentDTO, "createdAt" | "updatedAt">> {}

export interface FilterAppointmentDTO extends Partial<AppointmentDTO> {}
