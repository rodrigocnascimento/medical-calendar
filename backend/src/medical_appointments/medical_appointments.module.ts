import { Module } from '@nestjs/common';
import { MedicalAppointmentsService } from './medical_appointments.service';
import { MedicalAppointmentsController } from './medical_appointments.controller';
import { MedicalAppointmentRepository } from './medical_appointments.repository';
import { MedicalAppointment } from './medical_appointments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalAppointment])],
  controllers: [MedicalAppointmentsController],
  providers: [MedicalAppointmentsService, MedicalAppointmentRepository],
})
export class MedicalAppointmentsModule {}
