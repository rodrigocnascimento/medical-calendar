import { Entity, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MedicalRegistry } from './medical_registry.entity';

@Entity()
@Injectable()
export class MedicalRegistriesRepository extends Repository<MedicalRegistry> {}
