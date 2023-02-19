import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalAppointmentDto } from './dto/create.dto';
import { UpdateMedicalAppointmentDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalAppointmentRepository } from './medical_appointments.repository';
import { MedicalAppointment } from './medical_appointments.entity';
import { UUIDVersion } from 'class-validator';
import { MedicalAppointmentDTO } from './dto/medical_appointments.dto';

@Injectable()
export class MedicalAppointmentsService {
  constructor(
    @InjectRepository(MedicalAppointment)
    private medicalAppointmentRepo: MedicalAppointmentRepository,
  ) {}
  async create(createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    const foundPatient = await this.medicalAppointmentRepo.findOne({
      where: {
        patient: {
          id: createMedicalAppointmentDto.patient,
        },
      },
    });

    if (!foundPatient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    return this.medicalAppointmentRepo.save(
      createMedicalAppointmentDto as unknown as MedicalAppointmentDTO,
    );
  }

  update(
    id: UUIDVersion,
    updateMedicalAppointmentDto: UpdateMedicalAppointmentDto,
  ) {
    return this.medicalAppointmentRepo.update(id, updateMedicalAppointmentDto);
  }

  remove(id: UUIDVersion) {
    return this.medicalAppointmentRepo.delete(id);
  }

  findAll() {
    return this.medicalAppointmentRepo.find({
      relations: ['medicalRegistries', 'patient'],
    });
  }
}
