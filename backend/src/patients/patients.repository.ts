import { Entity, Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { Injectable } from '@nestjs/common';

@Entity()
@Injectable()
export class PatientsRepository extends Repository<Patient> {}
