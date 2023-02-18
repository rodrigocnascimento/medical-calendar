import { Entity, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MedicalAppointment } from './medical_appointments.entity';

@Entity()
@Injectable()
export class MedicalAppointmentRepository extends Repository<MedicalAppointment> {}
