import { MedicalRegistry } from '../medical_registries/medical_registry.entity';
import { Patient } from '../patients/patient.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('medical_appointments')
export class MedicalAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Patient, (patient: Patient) => patient.appointments)
  patient: Patient;

  @OneToMany(
    () => MedicalRegistry,
    (records: MedicalRegistry) => records.medicalAppointment,
  )
  medicalRegistries?: MedicalRegistry[];

  @ManyToOne(() => User, (user) => user.userAppointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;
}
