import { Between, DataSource, Entity, Repository } from "typeorm";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { MedicalAppointment } from "./medical_appointments.entity";

@Entity()
@Injectable()
export class MedicalAppointmentRepository extends Repository<MedicalAppointment> {
  constructor(private dataSource: DataSource) {
    super(MedicalAppointment, dataSource.createEntityManager());
  }

  async alreadyHasAppointment(medicalAppointmentDate: Date) {
    const pastHour = new Date(medicalAppointmentDate);

    pastHour.setHours(medicalAppointmentDate.getHours() - 1);

    const hasAppointment = await this.find({
      where: {
        date: Between(pastHour, medicalAppointmentDate),
      },
    });

    if (hasAppointment?.length) {
      throw new UnprocessableEntityException();
    }

    return false;
  }
}
