import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1580370051619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(`ALTER TYPE "contributions_status_enum" ADD VALUE Awaiting`);
        // await queryRunner.query(`ALTER TABLE contributions ALTER COLUMN "status" ALTER TYPE contributions_status_enum ADD VALUE "Awaiting"`);
        await queryRunner.query(`ALTER TYPE "contributions_status_enum" RENAME TO "_old_contributions_status_enum"`);
        await queryRunner.query(`CREATE TYPE "contributions_status_enum" AS ENUM('Archived', 'Draft', 'Submitted', 'Processed', 'Awaiting')`);
        await queryRunner.query(`ALTER TABLE contributions ALTER COLUMN "status" TYPE contributions_status_enum USING status::text::contributions_status_enum`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        
    }

}
