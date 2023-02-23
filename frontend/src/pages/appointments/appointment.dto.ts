export interface AppointmentDTO {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  patient: any;
  doctor: any;
}

export interface CreateAppointmentDTO extends Omit<AppointmentDTO, "id"> {}
export interface UpdateAppointmentDTO extends AppointmentDTO {}
