import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateMedicalAppointmentDto {
  @ApiProperty({
    description: 'O ID do paciente.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
  })
  @IsNotEmpty({
    message: 'O paciente deve ser informado.',
  })
  patient: string;

  @IsNotEmpty({
    message: 'Campo da data da consulta deve ser preenchido.',
  })
  @ApiProperty({
    description: 'A da consulta do paciente.',
    example: '1985-11-19',
  })
  @IsDateString()
  date: Date;
}
