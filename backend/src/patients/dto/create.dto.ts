import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import { PatientsDTO } from "./patient.dto";

export class CreatePatientDTO extends PartialType(PatientsDTO) {
  @IsOptional()
  @ApiProperty({
    description: "O ID do paciente.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
  })
  id: string;
}
