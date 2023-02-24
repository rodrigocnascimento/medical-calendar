import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateMedicalAppointmentDto } from "./create.dto";

export class UpdateMedicalAppointmentDto extends PartialType(
  OmitType(CreateMedicalAppointmentDto, ["patient"] as const)
) {}
