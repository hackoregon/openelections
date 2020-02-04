import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1580370051619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE contributions ALTER COLUMN "status" ALTER TYPE contributions_status_enum ADD VALUE "Awaiting"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
