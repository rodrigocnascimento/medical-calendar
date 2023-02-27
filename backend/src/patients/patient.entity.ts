import { MedicalAppointment } from "../medical_appointments/medical_appointments.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

/**
 * List of human genres
 * @readonly
 * @enum M Male
 * @enum F Female
 **/
export enum Genre {
  M = "M",
  F = "F",
}

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, length: 150 })
  name: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true, unique: true, length: 64 })
  email: string;

  @Column("decimal", { precision: 9, scale: 2, nullable: true })
  height: number;

  @Column("decimal", { precision: 9, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true, type: "enum", enum: Genre })
  genre?: Genre;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @OneToMany(() => MedicalAppointment, (appointments: MedicalAppointment) => appointments.patient)
  appointments?: MedicalAppointment[];

  @Column({ type: "text", nullable: true })
  lgpdKey: string;
}
