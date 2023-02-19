import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMedicalRegistryDTO } from './create.dto';

export class UpdateMedicalRegistryDTO extends PartialType(
  OmitType(CreateMedicalRegistryDTO, ['medicalAppointment'] as const),
) {}
