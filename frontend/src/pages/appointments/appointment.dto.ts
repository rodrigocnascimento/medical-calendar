export interface AppointmentDTO {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  patient: any;
  doctor: any;
}

export interface CreateAppointmentDTO
  extends Partial<Omit<AppointmentDTO, "createdAt" | "updatedAt">> {}
export interface UpdateAppointmentDTO
  extends Partial<Omit<AppointmentDTO, "createdAt" | "updatedAt">> {}

export interface FilterAppointmentDTO extends Partial<AppointmentDTO> {}
