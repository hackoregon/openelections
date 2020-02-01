import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1580370051619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE contributions_status_enum ADD VALUE 'Awaiting' AFTER 'Processed'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
