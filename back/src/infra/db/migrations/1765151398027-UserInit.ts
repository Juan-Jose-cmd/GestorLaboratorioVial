import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInit1765151398027 implements MigrationInterface {
    name = 'UserInit1765151398027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_rol_enum" AS ENUM('laboratorista', 'director', 'jerarquico')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "activo" boolean NOT NULL DEFAULT true, "rol" "public"."users_rol_enum" NOT NULL, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."obras_estado_enum" AS ENUM('activa', 'pausada', 'finalizada')`);
        await queryRunner.query(`CREATE TABLE "obras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ubicacion" character varying NOT NULL, "estado" "public"."obras_estado_enum" NOT NULL DEFAULT 'activa', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "directorId" uuid NOT NULL, CONSTRAINT "PK_1645460dfba8e8c144ecd8436da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_tipo_enum" AS ENUM('suelo', 'hormigon', 'asfalto')`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_prioridad_enum" AS ENUM('normal', 'alta', 'urgente')`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_estado_enum" AS ENUM('pendiente', 'aceptada', 'en_proceso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`CREATE TABLE "solicitudes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."solicitudes_tipo_enum" NOT NULL, "prioridad" "public"."solicitudes_prioridad_enum" NOT NULL DEFAULT 'normal', "estado" "public"."solicitudes_estado_enum" NOT NULL DEFAULT 'pendiente', "descripcion" character varying, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "obraId" uuid NOT NULL, "creadoPorId" uuid NOT NULL, CONSTRAINT "PK_8c7e99758c774b801853b538647" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "obras" ADD CONSTRAINT "FK_ccac3c4472c196fb1a5d37ae55d" FOREIGN KEY ("directorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solicitudes" ADD CONSTRAINT "FK_502cda837793a092ef609b9392e" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solicitudes" ADD CONSTRAINT "FK_04672c3e21e8ecc5871db4f58ee" FOREIGN KEY ("creadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitudes" DROP CONSTRAINT "FK_04672c3e21e8ecc5871db4f58ee"`);
        await queryRunner.query(`ALTER TABLE "solicitudes" DROP CONSTRAINT "FK_502cda837793a092ef609b9392e"`);
        await queryRunner.query(`ALTER TABLE "obras" DROP CONSTRAINT "FK_ccac3c4472c196fb1a5d37ae55d"`);
        await queryRunner.query(`DROP TABLE "solicitudes"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_prioridad_enum"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "obras"`);
        await queryRunner.query(`DROP TYPE "public"."obras_estado_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_rol_enum"`);
    }

}
