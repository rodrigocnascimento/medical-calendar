export interface AppointmentDTO {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  patient: any;
  doctor: any;
}

export interface CreateAppointmentDTO
  extends Omit<AppointmentDTO, "id" | "createdAt" | "updatedAt"> {}
export interface UpdateAppointmentDTO extends Omit<AppointmentDTO, "createdAt" | "updatedAt"> {}
