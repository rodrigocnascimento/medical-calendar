import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthDTO {
  @Expose()
  @ApiProperty({
    description: 'O username do usuário. Nesse caso, o email do usuário.',
    example: 'email@mail.com',
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'O email do usuário.',
    example: 'SECRET',
  })
  password: string;
}

export class BearerTokenDTO {
  @Expose()
  @ApiProperty({
    description: 'O username do usuário. Nesse caso, o email do usuário.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTY3NjkwNjUyNSwiZXhwIjoxNjc2OTA2ODI1fQ.X9RZHLr_j9XXu49gQs2Vxq0Ty5sdze5mfIEI2wOxXlo',
  })
  accessToken: string;
}
