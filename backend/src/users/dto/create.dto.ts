import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";

import { UsersDTO } from "./user.dto";
import { Expose } from "class-transformer";

export class CreateUserDTO extends PartialType(
  OmitType(UsersDTO, ["id", "createdAt", "updatedAt"] as const)
) {
  @Expose()
  @ApiProperty({
    description: "A senha do usuário.",
    example: "SECRET: [A-Za-z0-9!@#$%&*)(]",
  })
  password: string;
}
