import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
export class MigrationMestreUser1677123751798 implements MigrationInterface {
  name = "MigrationMestreUser1677123751798";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash("123123", 1_0);

    await queryRunner.query(`
            INSERT INTO users 
                (id,name,email,"role","password",created_at,updated_at) 
            VALUES ('8d184f2f-cac4-48e8-be05-8d0a5dbb3ba9','User Mestre','user_mestre@email.com','admin','${hashedPassword}','2023-02-23 11:27:55.87583','2023-02-23 11:27:55.87583');
        `);

    await queryRunner.query(`
        INSERT INTO users 
            (id,name,email,"role","password",created_at,updated_at) 
        VALUES ('7d184f2f-cac4-48e8-be05-8d0a5dbb3ba9','Medico 0','medico0@email.com','doctor','${hashedPassword}','2023-02-23 11:27:55.87583','2023-02-23 11:27:55.87583');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE id = '8d184f2f-cac4-48e8-be05-8d0a5dbb3ba9'`);
    await queryRunner.query(`DELETE FROM users WHERE id = '7d184f2f-cac4-48e8-be05-8d0a5dbb3ba9'`);
  }
}
