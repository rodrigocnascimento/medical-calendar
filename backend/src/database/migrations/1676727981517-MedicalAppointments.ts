import { MigrationInterface, QueryRunner } from "typeorm";

export class MedicalAppointments1676727981517 implements MigrationInterface {
  name = "MedicalAppointments1676727981517";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medical_appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "patientId" uuid, CONSTRAINT "PK_b3c5e3ac59463eb69f03b6bb82b" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "medical_appointments"`);
  }
}
