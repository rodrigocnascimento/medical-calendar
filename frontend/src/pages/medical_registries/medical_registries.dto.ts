export interface MedicallRegistriesDTO {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  observation: any;
}

export interface CreateMedicallRegistriesDTO
  extends Omit<MedicallRegistriesDTO, "id"> {}
export interface UpdateMedicallRegistriesDTO extends MedicallRegistriesDTO {}
