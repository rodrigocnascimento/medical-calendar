import { DataSource, Entity, Repository } from 'typeorm';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MedicalAppointment } from './medical_appointments.entity';

@Entity()
@Injectable()
export class MedicalAppointmentRepository extends Repository<MedicalAppointment> {
  constructor(private dataSource: DataSource) {
    super(MedicalAppointment, dataSource.createEntityManager());
  }

  async alreadyHasAppointment(medicalAppointmentDate: Date) {
    const hasAppointment = await this.find({
      where: {
        date: medicalAppointmentDate,
      },
    });

    if (hasAppointment?.length) {
      throw new UnprocessableEntityException();
    }

    return false;
  }
}
