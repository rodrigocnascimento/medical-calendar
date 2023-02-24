import { ApiProperty } from "@nestjs/swagger";
import { Patient } from "../../patients/patient.entity";
import { MedicalRegistryDTO } from "../../medical_registries/dto/medical_registry.dto";
import { Expose } from "class-transformer";

export class MedicalAppointmentDTO {
  @Expose()
  @ApiProperty({
    description: "O ID da consulta.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "O ID do paciente.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
    type: Patient,
  })
  patient: Patient;

  @Expose()
  @ApiProperty({
    description: "A da consulta do paciente.",
    example: "2023-03-03T00:00:00.000Z",
  })
  date: Date;

  @Expose()
  @ApiProperty({
    description: "A data da criação da consulta do paciente.",
    example: "2023-03-03T00:00:00.000Z",
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: "A data da última atualização da consulta do paciente.",
    example: "2023-03-03T00:00:00.000Z",
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: "Os registros médicos da consulta.",
    type: () => MedicalRegistryDTO,
    isArray: true,
  })
  medicalRegistry: MedicalRegistryDTO[];
}
