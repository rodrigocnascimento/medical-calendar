import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDTO } from './dto/create.dto';
import { PatientsRepository } from './patients.repository';
import { UpdatePatientDTO } from './dto/update.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: PatientsRepository,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  async findOne(id: string): Promise<Patient> {
    try {
      return await this.patientsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['appointments'],
      });
    } catch (error) {
      throw new NotFoundException('Paciente não encontrado.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.patientsRepository.delete(id);
  }

  async save(patient: CreatePatientDTO): Promise<Patient> {
    const emailAlreadyRegistered = await this.getEmailOrFail(patient.email);

    if (emailAlreadyRegistered) {
      throw new UnprocessableEntityException(
        'Email de paciente já cadastrado.',
      );
    }

    return this.patientsRepository.save(patient);
  }

  async update(patient: UpdatePatientDTO): Promise<Patient | UpdateResult> {
    const lookupPatient = await this.patientsRepository.findOne({
      where: {
        id: patient.id,
      },
    });

    if (!lookupPatient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const wasPatientUpdated = await this.patientsRepository.update(
      patient.id,
      patient,
    );

    if (wasPatientUpdated.affected) {
      return this.patientsRepository.findOne({
        where: {
          id: patient.id,
        },
      });
    }

    return wasPatientUpdated;
  }

  async getEmailOrFail(patientEmail: string): Promise<Patient> {
    return this.patientsRepository.findOne({
      where: {
        email: patientEmail,
      },
    });
  }
}
