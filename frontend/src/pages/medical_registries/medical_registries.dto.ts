export interface MedicallRegistriesDTO {
  id: string;
  date: Date;
  observation: any;
  medicalAppointment: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicallRegistriesDTO
  extends Partial<Omit<MedicallRegistriesDTO, "createdAt" | "updatedAt">> {}
export interface UpdateMedicallRegistriesDTO
  extends Partial<Omit<MedicallRegistriesDTO, "createdAt" | "updatedAt">> {}
