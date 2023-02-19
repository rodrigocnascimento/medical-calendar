import { Module } from '@nestjs/common';
import { MedicalRegistriesService } from './medical_registries.service';
import { MedicalRegistriesController } from './medical_registries.controller';
import { MedicalAppointmentRepository } from 'src/medical_appointments/medical_appointments.repository';
import { MedicalRegistry } from './medical_registry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRegistry])],
  controllers: [MedicalRegistriesController],
  providers: [MedicalRegistriesService, MedicalAppointmentRepository],
})
export class MedicalRegistriesModule {}
