import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";

import { UsersDTO } from "./user.dto";
import { Expose } from "class-transformer";
import { IsString, MinLength, Matches } from "class-validator";

export class CreateUserDTO extends PartialType(
  OmitType(UsersDTO, ["id", "createdAt", "updatedAt"] as const)
) {
  @Expose()
  @ApiProperty({
    description: "A senha do usuário.",
    example: "SECRET",
  })
  @IsString({
    message: "Uma senha deve ser fornecida.",
  })
  @MinLength(6, {
    message: "A senha precisa ter pelo menos 6 caracteres.",
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Senha muito fraca. Entre os caracteres é obrigado uma letra maiúscula, uma minúsucula, um númer e uma caracter especial.",
  })
  password: string;
}
