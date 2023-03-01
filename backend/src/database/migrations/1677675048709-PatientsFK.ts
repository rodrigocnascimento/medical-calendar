import { MigrationInterface, QueryRunner } from "typeorm";

export class PatientsFK1677675048709 implements MigrationInterface {
  name = "PatientsFK1677675048709";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_registries" DROP CONSTRAINT "FK_eef13e1264b74d61cdb64148108"`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" ADD CONSTRAINT "FK_eef13e1264b74d61cdb64148108" FOREIGN KEY ("medicalAppointmentId") REFERENCES "medical_appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" ADD CONSTRAINT "FK_fe453fa8ff1f01f2628fe291b4d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" DROP CONSTRAINT "FK_fe453fa8ff1f01f2628fe291b4d"`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" DROP CONSTRAINT "FK_eef13e1264b74d61cdb64148108"`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" ADD CONSTRAINT "FK_eef13e1264b74d61cdb64148108" FOREIGN KEY ("medicalAppointmentId") REFERENCES "medical_appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
