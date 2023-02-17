import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
} from 'class-validator';

import { Genre } from '../patient.entity';

export class CreatePatientDTO {
  @IsOptional()
  @ApiProperty({
    description: 'O ID do paciente.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
  })
  id: string;

  @IsNotEmpty({
    message: 'Campo nome deve ser preenchido.',
  })
  @ApiProperty({
    description: 'O nome do paciente.',
    example: 'John Doe',
  })
  name: string;

  @IsString({ message: 'Email inválido.' })
  @IsNotEmpty({
    message: 'Precisa informar um email.',
  })
  @IsEmail({}, { message: 'Email inválido.' })
  @ApiProperty({
    description: 'Email do paciente. Esse email é único.',
    example: 'john.doe@mail.com',
  })
  email: string;

  @IsNotEmpty({
    message: 'Campo data de nascimento deve ser preenchido.',
  })
  @IsDateString(
    {},
    {
      message: 'Campo data de nascimento inválido.',
    },
  )
  @ApiProperty({
    description: 'A data de nascimento do paciente.',
    example: '1985-11-19',
  })
  dob: Date;

  @ApiProperty({
    description: 'O telefone do paciente.',
    example: '+55 11 9999-9999',
  })
  phone: string;

  @IsNotEmpty({
    message: 'A altura do paciente deve ser informada.',
  })
  @ApiProperty({
    description: 'A altura do paciente.',
    example: '172.8',
  })
  height: number;

  @IsNotEmpty({
    message: 'O peso do paciente deve ser informada.',
  })
  @ApiProperty({
    description: 'O peso do paciente.',
    example: '99.8',
  })
  weight: number;

  @ApiProperty({
    description: 'O gênero do paciente.',
    example: '99.8',
  })
  genre: Genre;

  @ApiProperty({
    description: 'A data de criação do paciente.',
    example: '2023-02-17',
  })
  createdAt: Date;
}
