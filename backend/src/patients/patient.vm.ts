import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, Expose } from 'class-transformer';

import { Patient, Genre } from './patient.entity';

export class PatientVM {
  @Expose()
  @ApiProperty({
    description: 'O ID do paciente.',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'O nome do paciente.',
    example: 'Rodrigo Nascimento',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'O email do paciente é unico por paciente.',
    example: 'nome@email.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'A data de nascimento do paciente.',
    example: '19/11/1985',
  })
  dob: Date;

  @Expose()
  @ApiProperty({
    description: 'O telefone do paciente.',
    example: '+55 11 9999-9999',
  })
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'A altura do paciente.',
    example: '172.8',
  })
  height: number;

  @Expose()
  @ApiProperty({
    description: 'O peso do paciente.',
    example: '99.8',
  })
  weight: number;

  @Expose()
  @ApiProperty({
    description: 'O gênero do paciente.',
    example: 'M',
  })
  genre: Genre;

  @Expose()
  @ApiProperty({ description: 'A data de criação do paciente.' })
  createdAt: Date;

  static toViewModel(patient: Patient): PatientVM {
    return plainToClass(PatientVM, patient, { excludeExtraneousValues: true });
  }

  static fromViewModel<T extends Patient>(vm: T): PatientVM {
    return PatientVM.toViewModel(vm);
  }
}
