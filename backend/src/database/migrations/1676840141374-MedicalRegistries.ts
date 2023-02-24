import { MigrationInterface, QueryRunner } from "typeorm";

export class MedicalRegistries1676840141374 implements MigrationInterface {
  name = "MedicalRegistries1676840141374";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medical_registries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "observation" text NOT NULL, "medicalAppointmentId" uuid, CONSTRAINT "PK_6fc527dc00d78fc1e404de9b920" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "medical_registries" ADD CONSTRAINT "FK_eef13e1264b74d61cdb64148108" FOREIGN KEY ("medicalAppointmentId") REFERENCES "medical_appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_registries" DROP CONSTRAINT "FK_eef13e1264b74d61cdb64148108"`
    );
    await queryRunner.query(`DROP TABLE "medical_registries"`);
  }
}
