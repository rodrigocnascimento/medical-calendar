export interface MedicalRegistriesDTO {
  id: string;
  date: Date;
  observation: any;
  medicalAppointment: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalRegistriesDTO
  extends Partial<Omit<MedicalRegistriesDTO, "createdAt" | "updatedAt">> {}
export interface UpdateMedicalRegistriesDTO
  extends Partial<Omit<MedicalRegistriesDTO, "createdAt" | "updatedAt">> {}

export interface FilterMedicalRegistriesDTO
  extends Partial<MedicalRegistriesDTO> {}
