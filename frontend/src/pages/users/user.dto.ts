/**
 * List of user roles
 * @readonly
 * @enum M Male
 * @enum F Female
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO extends Omit<UserDTO, "id"> {}
export interface UpdateUserDTO extends UserDTO {}
