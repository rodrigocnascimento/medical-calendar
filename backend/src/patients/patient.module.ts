import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientService, PatientRepository],
})
export class PatientsModule {}
