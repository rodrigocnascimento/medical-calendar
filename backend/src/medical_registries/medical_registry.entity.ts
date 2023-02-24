import { MedicalAppointment } from "../medical_appointments/medical_appointments.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

@Entity("medical_registries")
export class MedicalRegistry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({
    type: "text",
  })
  observation: string;

  @ManyToOne(() => MedicalAppointment, (record: MedicalAppointment) => record.medicalRegistries)
  medicalAppointment: MedicalAppointment;
}
