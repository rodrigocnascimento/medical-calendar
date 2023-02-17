import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestError {
  @ApiProperty({
    description: 'O código do erro.',
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Mensagem(s) de erro.',
    example: `[
      {
        "name": [
          "Campo nome deve ser preenchido."
        ]
      }
    ]`,
  })
  message: Array<{ name: string[] }>;

  @ApiProperty({
    description: 'Name of Exception',
    example: '/users',
  })
  error: string;
}
