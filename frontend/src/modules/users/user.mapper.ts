import ListMapper from "domain/mapper";
import { UserDTO, DoctorMUIDropDownListDTO } from "./index";

/**
 * A mapper to transform the value received from a source, into a DropDown list.
 * specifically to MUI Material UI dropdown list
 * @param user user data fetched
 * @returns {DoctorDropDownListDTO} the dropdown user list
 */
function MapperDoctorDropDownList(user: UserDTO): DoctorMUIDropDownListDTO {
  return {
    id: user.id,
    label: user.name,
  };
}
export const mapDoctorDropDownList = ListMapper(MapperDoctorDropDownList);
