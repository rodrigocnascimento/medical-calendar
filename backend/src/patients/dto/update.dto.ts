import { ApiProperty, PartialType } from "@nestjs/swagger";

import { CreatePatientDTO } from "./create.dto";

export class UpdatePatientDTO extends PartialType(CreatePatientDTO) {
  @ApiProperty({
    description: "O ID do paciente.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
  })
  id: string;
}
