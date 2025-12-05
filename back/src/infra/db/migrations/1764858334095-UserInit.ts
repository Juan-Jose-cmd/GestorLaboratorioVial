import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInit1764858334095 implements MigrationInterface {
    name = 'UserInit1764858334095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."obras_estado_enum" AS ENUM('activa', 'pausada', 'finalizada')`);
        await queryRunner.query(`CREATE TABLE "obras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ubicacion" character varying NOT NULL, "estado" "public"."obras_estado_enum" NOT NULL DEFAULT 'activa', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "directorId" uuid NOT NULL, CONSTRAINT "PK_1645460dfba8e8c144ecd8436da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "obras" ADD CONSTRAINT "FK_ccac3c4472c196fb1a5d37ae55d" FOREIGN KEY ("directorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "obras" DROP CONSTRAINT "FK_ccac3c4472c196fb1a5d37ae55d"`);
        await queryRunner.query(`DROP TABLE "obras"`);
        await queryRunner.query(`DROP TYPE "public"."obras_estado_enum"`);
    }

}
