import ListMapper from "../../domain/mapper";
import { DoctorUserDTO, DoctorDropDownListDTO } from "./user.dto";

export function MapperDoctorDropDownList(user: DoctorUserDTO): DoctorDropDownListDTO {
  return {
    id: user.id,
    label: user.name,
  };
}
export const mapperDoctorListDropDown = ListMapper(MapperDoctorDropDownList);
