import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSoftDelete1677720588147 implements MigrationInterface {
    name = 'UserSoftDelete1677720588147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    }

}
