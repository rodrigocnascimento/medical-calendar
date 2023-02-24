import { MedicalAppointment } from "../medical_appointments/medical_appointments.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";

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

  @Column({
    length: 150,
  })
  name: string;

  @Column({
    length: 20,
  })
  phone?: string;

  @Column()
  dob: Date;

  @Column({ unique: true, length: 64 })
  email: string;

  @Column("decimal", { precision: 9, scale: 2 })
  height: number;

  @Column("decimal", { precision: 9, scale: 2 })
  weight: number;

  @Column({
    type: "enum",
    enum: Genre,
  })
  genre: Genre;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @OneToMany(() => MedicalAppointment, (appointments: MedicalAppointment) => appointments.patient)
  appointments?: MedicalAppointment[];
}
