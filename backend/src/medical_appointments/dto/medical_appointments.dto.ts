import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patients/patient.entity';

export class MedicalAppointmentDto {
  @ApiProperty({
    description: 'O ID da consulta.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
  })
  id: string;

  @ApiProperty({
    description: 'O ID do paciente.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
    type: Object,
  })
  patient: Patient;

  @ApiProperty({
    description: 'A da consulta do paciente.',
    example: '2023-03-03T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'A data da criação da consulta do paciente.',
    example: '2023-03-03T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'A data da última atualização da consulta do paciente.',
    example: '2023-03-03T00:00:00.000Z',
  })
  updatedAt: Date;
}
