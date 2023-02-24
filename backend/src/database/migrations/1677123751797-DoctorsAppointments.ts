import { MigrationInterface, QueryRunner } from 'typeorm';

export class DoctorsAppointments1677123751797 implements MigrationInterface {
  name = 'DoctorsAppointments1677123751797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" ADD "doctorId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" ADD CONSTRAINT "FK_68deff60e79599a99d3ba72b72a" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" DROP CONSTRAINT "FK_68deff60e79599a99d3ba72b72a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" DROP COLUMN "doctorId"`,
    );
  }
}
