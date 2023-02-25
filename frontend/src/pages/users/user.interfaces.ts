import { IRepositories } from "domain/repository";

/**
 * List of user roles
 * @readonly
 * @enum {string} UserRoles
 * @property {string} ADMIN - System Administrador. Has access in all system areas.
 * @property {string} DOCTOR - Doctors. Has access in appointments and patients.
 * @property {string} PATIENT - Patients. Can access only they're appointments.
 **/
export enum UserRoles {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  password: string;
  passwordConfirmation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO extends Partial<Omit<UserDTO, "createdAt" | "updatedAt">> {}
export interface UpdateUserDTO extends Partial<Omit<UserDTO, "createdAt" | "updatedAt">> {}

export interface FilterUserDTO extends Partial<UserDTO> {}

export type DoctorMUIDropDownListDTO = {
  id: string;
  label: string;
};

export type UsersComponentProps = {
  repository: Pick<IRepositories, "user">;
};
