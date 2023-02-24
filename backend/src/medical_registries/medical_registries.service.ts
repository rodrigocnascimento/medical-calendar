import { Injectable } from "@nestjs/common";
import { CreateMedicalRegistryDTO } from "./dto/create.dto";
import { UpdateMedicalRegistryDTO } from "./dto/update.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MedicalRegistry } from "./medical_registry.entity";
import { MedicalRegistriesRepository } from "./medical_registries.repository";
import { UUIDVersion } from "class-validator";
import { MedicalRegistryDTO } from "./dto/medical_registry.dto";

@Injectable()
export class MedicalRegistriesService {
  constructor(
    @InjectRepository(MedicalRegistry)
    private readonly medicalRegistryRepo: MedicalRegistriesRepository
  ) {}
  create(createMedicalRegistryDto: CreateMedicalRegistryDTO) {
    return this.medicalRegistryRepo.save(createMedicalRegistryDto as unknown as MedicalRegistryDTO);
  }

  update(id: UUIDVersion, updateMedicalRegistryDto: UpdateMedicalRegistryDTO) {
    return this.medicalRegistryRepo.update(id, updateMedicalRegistryDto);
  }

  remove(id: UUIDVersion) {
    return this.medicalRegistryRepo.delete(id);
  }
}
