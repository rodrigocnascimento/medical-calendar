export interface PatientDTO {
  id: string;
  name: string;
  email: string;
  dob: Date;
  phone: string;
  height: number;
  weight: number;
  genre: string;
  createdAt: Date;
}

export interface CreatePatientDTO extends Omit<PatientDTO, "id"> {}
export interface UpdatePatientDTO extends PatientDTO {}
