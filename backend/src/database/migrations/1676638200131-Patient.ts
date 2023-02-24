import { MigrationInterface, QueryRunner } from "typeorm";

export class Patient1676638200131 implements MigrationInterface {
  name = "Patient1676638200131";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE public."patients_genre_enum" AS ENUM ('M', 'F');`);

    await queryRunner.query(
      `CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "phone" character varying(20) NOT NULL, "dob" TIMESTAMP NOT NULL, "email" character varying(64) NOT NULL, "height" numeric(9,2) NOT NULL, "weight" numeric(9,2) NOT NULL, "genre" "public"."patients_genre_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE ("email"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "patients"`);
    await queryRunner.query(`DROP TYPE public."patients_genre_enum";`);
  }
}
