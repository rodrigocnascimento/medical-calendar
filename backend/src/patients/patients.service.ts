import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "./patient.entity";
import { CreatePatientDTO } from "./dto/create.dto";
import { PatientsRepository } from "./patients.repository";
import { UpdatePatientDTO } from "./dto/update.dto";
import { DeleteResult, UpdateResult } from "typeorm";
import { CryptoService } from "src/crypto.service";

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: PatientsRepository,
    @Inject(CryptoService)
    private cryptoService: CryptoService
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      relations: ["appointments"],
    });
  }

  async findOne(id: string): Promise<Patient> {
    try {
      return await this.patientsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ["appointments"],
      });
    } catch (error) {
      throw new NotFoundException("Paciente não encontrado.");
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.patientsRepository.delete(id);
  }

  async save(patient: CreatePatientDTO): Promise<Patient> {
    const emailAlreadyRegistered = await this.getEmailOrFail(patient.email);

    if (emailAlreadyRegistered) {
      throw new UnprocessableEntityException("Email de paciente já cadastrado.");
    }

    return this.patientsRepository.save(patient);
  }

  async update(patient: UpdatePatientDTO): Promise<Patient | UpdateResult> {
    delete patient.appointments;
    const lookupPatient = await this.patientsRepository.findOne({
      where: {
        id: patient.id,
      },
    });

    if (!lookupPatient) {
      throw new NotFoundException("Paciente não encontrado.");
    }

    const wasPatientUpdated = await this.patientsRepository.update(patient.id, patient);

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
    if (!patientEmail) {
      throw new UnprocessableEntityException("Precisa informar um email.");
    }

    return this.patientsRepository.findOne({
      where: {
        email: patientEmail,
      },
    });
  }

  async lgpdDeletion(patientId) {
    const lookupPatient = await this.patientsRepository.findOne({
      where: {
        id: patientId,
        lgpdKey: null,
      },
    });

    const cryptedData = this.cryptoService.encrypt(JSON.stringify(lookupPatient));

    await this.patientsRepository.update(lookupPatient.id, {
      ...lookupPatient,
      lgpdKey: cryptedData,
      name: null,
      phone: null,
      dob: null,
      email: null,
      height: null,
      weight: null,
      genre: null,
    });

    return this.patientsRepository.softDelete(lookupPatient.id);
  }
}
