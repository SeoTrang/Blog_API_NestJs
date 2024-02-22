import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1708484044659 implements MigrationInterface {
    name = 'CreateUserTable1708484044659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    }

}
