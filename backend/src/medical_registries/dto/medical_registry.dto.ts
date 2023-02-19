import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MedicalAppointment } from '../../medical_appointments/medical_appointments.entity';

export class MedicalRegistryDTO {
  @Expose()
  @ApiProperty({
    description: 'O ID do registro.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Conteúdo livre.',
  })
  observation: string;

  @Expose()
  @ApiProperty({ description: 'A data de criação do registro.' })
  createdAt: Date;

  @ApiProperty({ description: 'Id da consulta.' })
  medicalAppointment: MedicalAppointment;
}
