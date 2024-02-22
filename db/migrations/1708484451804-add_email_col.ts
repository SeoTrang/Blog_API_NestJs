import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailCol1708484451804 implements MigrationInterface {
    name = 'AddEmailCol1708484451804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
