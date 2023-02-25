import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { UsersDTO } from "src/users/dto/user.dto";

export class AuthDTO {
  @Expose()
  @ApiProperty({
    description: "O username do usuário. Nesse caso, o email do usuário.",
    example: "email@mail.com",
  })
  @IsString({ message: "Email inválido." })
  @IsNotEmpty({
    message: "Precisa informar um email.",
  })
  @IsEmail({}, { message: "Email inválido." })
  @MaxLength(64)
  username: string;

  @Expose()
  @ApiProperty({
    description: "A senha do usuário.",
    example: "SECRET",
  })
  @IsNotEmpty({
    message: "Precisa informar a senha.",
  })
  password: string;

  user: UsersDTO;
}

export class BearerTokenDTO {
  @Expose()
  @ApiProperty({
    description: "O username do usuário. Nesse caso, o email do usuário.",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTY3NjkwNjUyNSwiZXhwIjoxNjc2OTA2ODI1fQ.X9RZHLr_j9XXu49gQs2Vxq0Ty5sdze5mfIEI2wOxXlo",
  })
  accessToken: string;
}
