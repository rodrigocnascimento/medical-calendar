import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMedicalAppointmentDto } from './dto/create.dto';
import { UpdateMedicalAppointmentDto } from './dto/update.dto';
import { MedicalAppointmentRepository } from './medical_appointments.repository';
import { UUIDVersion } from 'class-validator';
import { MedicalAppointmentDTO } from './dto/medical_appointments.dto';

@Injectable()
export class MedicalAppointmentsService {
  constructor(private medicalAppointmentRepo: MedicalAppointmentRepository) {}
  async create(createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    try {
      await this.medicalAppointmentRepo.alreadyHasAppointment(
        createMedicalAppointmentDto.date,
      );

      return await this.medicalAppointmentRepo.save(
        createMedicalAppointmentDto as unknown as MedicalAppointmentDTO,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException(
          'Já tem uma consulta nesse horário.',
        );
      }

      throw new NotFoundException('Paciente não encontrado.');
    }
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
