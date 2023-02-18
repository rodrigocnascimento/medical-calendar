import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundError {
  @ApiProperty({
    description: 'O código do erro.',
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Mensagem(s) de erro.',
    example: '<Entity> não encontrado.',
  })
  message: string;

  @ApiProperty({
    description: 'Nome do erro',
    example: 'Not Found',
  })
  error: string;
}
