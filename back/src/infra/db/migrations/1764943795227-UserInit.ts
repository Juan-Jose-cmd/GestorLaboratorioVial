import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInit1764943795227 implements MigrationInterface {
    name = 'UserInit1764943795227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_tipo_enum" AS ENUM('suelo', 'hormigon', 'asfalto')`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_prioridad_enum" AS ENUM('normal', 'alta', 'urgente')`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_estado_enum" AS ENUM('pendiente', 'aceptada', 'en_proceso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`CREATE TABLE "solicitudes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."solicitudes_tipo_enum" NOT NULL, "prioridad" "public"."solicitudes_prioridad_enum" NOT NULL DEFAULT 'normal', "estado" "public"."solicitudes_estado_enum" NOT NULL DEFAULT 'pendiente', "descripcion" character varying, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "obraId" uuid NOT NULL, "creadoPorId" uuid NOT NULL, CONSTRAINT "PK_8c7e99758c774b801853b538647" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "solicitudes" ADD CONSTRAINT "FK_502cda837793a092ef609b9392e" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solicitudes" ADD CONSTRAINT "FK_04672c3e21e8ecc5871db4f58ee" FOREIGN KEY ("creadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitudes" DROP CONSTRAINT "FK_04672c3e21e8ecc5871db4f58ee"`);
        await queryRunner.query(`ALTER TABLE "solicitudes" DROP CONSTRAINT "FK_502cda837793a092ef609b9392e"`);
        await queryRunner.query(`DROP TABLE "solicitudes"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_prioridad_enum"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_tipo_enum"`);
    }

}
