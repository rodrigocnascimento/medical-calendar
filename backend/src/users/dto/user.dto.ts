import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserRoles } from "../user.entity";
import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from "class-validator";

export class UsersDTO {
  @Expose()
  @ApiProperty({
    description: "O ID do usuário.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
  })
  id: string;

  @Expose()
  @IsNotEmpty({
    message: "Deve informar o nome do usuário.",
  })
  @ApiProperty({
    description: "O nome do usuário.",
    example: "Rodrigo Nascimento",
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "O email do usuário.",
    example: "nome@email.com",
  })
  @IsNotEmpty({
    message: "Precisa informar um email.",
  })
  @IsEmail({}, { message: "Email inválido." })
  @MaxLength(64)
  email: string;

  @ApiProperty({
    type: "enum",
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @Expose()
  @ApiProperty({ description: "A data de criação do paciente." })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: "A data de criação do paciente." })
  updatedAt?: Date;
}

export type FilterUsersDTO = Omit<UsersDTO, "password">;
