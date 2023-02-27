import { MigrationInterface, QueryRunner } from "typeorm";

export class PatientLgpd1677475393342 implements MigrationInterface {
  name = "PatientLgpd1677475393342";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_registries" DROP CONSTRAINT "FK_eef13e1264b74d61cdb64148108"`
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "lgpdKey" character varying NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "dob" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "phone" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "height" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "weight" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "genre" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" ADD CONSTRAINT "FK_eef13e1264b74d61cdb64148108" FOREIGN KEY ("medicalAppointmentId") REFERENCES "medical_appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_appointments" DROP CONSTRAINT "FK_fe453fa8ff1f01f2628fe291b4d"`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" DROP CONSTRAINT "FK_eef13e1264b74d61cdb64148108"`
    );
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "genre" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "weight" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "height" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "phone" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "lgpdKey"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "dob" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "medical_registries" ADD CONSTRAINT "FK_eef13e1264b74d61cdb64148108" FOREIGN KEY ("medicalAppointmentId") REFERENCES "medical_appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
