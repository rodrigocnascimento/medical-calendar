import { PartialType, OmitType, ApiProperty } from "@nestjs/swagger";
import { MedicalRegistryDTO } from "./medical_registry.dto";
import { Expose } from "class-transformer";

export class CreateMedicalRegistryDTO extends PartialType(
  OmitType(MedicalRegistryDTO, ["id", "createdAt", "medicalAppointment"] as const)
) {
  @Expose()
  @ApiProperty()
  medicalAppointment: string;
}
