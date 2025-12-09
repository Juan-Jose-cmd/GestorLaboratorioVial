import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInit1765295488435 implements MigrationInterface {
    name = 'UserInit1765295488435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."equipos_estado_enum" AS ENUM('operativo', 'mantenimiento', 'fuera_de_servicio')`);
        await queryRunner.query(`CREATE TABLE "equipos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "descripcion" character varying, "codigoInterno" character varying NOT NULL, "estado" "public"."equipos_estado_enum" NOT NULL DEFAULT 'operativo', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "obraActualId" uuid, CONSTRAINT "PK_451fffd8d175b5b7aadbf5ba760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."historial_equipo_tipo_enum" AS ENUM('asignacion', 'cambio_obra', 'retiro_obra', 'mantenimiento')`);
        await queryRunner.query(`CREATE TABLE "historial_equipo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."historial_equipo_tipo_enum" NOT NULL, "descripcion" text, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "equipoId" uuid NOT NULL, "obraOrigenId" uuid, "obraDestinoId" uuid, "realizadoPorId" uuid, CONSTRAINT "PK_ddca892671e1db2146e0fd09cad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."informes_estado_enum" AS ENUM('pendiente', 'generado', 'entregado')`);
        await queryRunner.query(`CREATE TABLE "informes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "estado" "public"."informes_estado_enum" NOT NULL DEFAULT 'pendiente', "archivoUrl" text NOT NULL, "nombreArchivo" text NOT NULL, "version" integer NOT NULL DEFAULT '1', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "ensayoId" uuid NOT NULL, "generadoPorId" uuid NOT NULL, CONSTRAINT "REL_7a00ddcef07beade03960bc6c7" UNIQUE ("ensayoId"), CONSTRAINT "PK_334e8397b700b9e81a66f645b1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ensayos" ADD "imagenesGraficos" text array`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_c39d3171e475b484753bb4b2e18" FOREIGN KEY ("obraActualId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" ADD CONSTRAINT "FK_91027bbe7709ade7d7c16b16ac3" FOREIGN KEY ("equipoId") REFERENCES "equipos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" ADD CONSTRAINT "FK_ca848439a3f1e5d5e7e1fee216d" FOREIGN KEY ("obraOrigenId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" ADD CONSTRAINT "FK_ae16afc9544afa6a4bc7a461f7d" FOREIGN KEY ("obraDestinoId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" ADD CONSTRAINT "FK_0f32443d066674c32668797ab67" FOREIGN KEY ("realizadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "informes" ADD CONSTRAINT "FK_7a00ddcef07beade03960bc6c7a" FOREIGN KEY ("ensayoId") REFERENCES "ensayos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "informes" ADD CONSTRAINT "FK_a5a028768fe2b9b1e2d8f5800c9" FOREIGN KEY ("generadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "informes" DROP CONSTRAINT "FK_a5a028768fe2b9b1e2d8f5800c9"`);
        await queryRunner.query(`ALTER TABLE "informes" DROP CONSTRAINT "FK_7a00ddcef07beade03960bc6c7a"`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" DROP CONSTRAINT "FK_0f32443d066674c32668797ab67"`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" DROP CONSTRAINT "FK_ae16afc9544afa6a4bc7a461f7d"`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" DROP CONSTRAINT "FK_ca848439a3f1e5d5e7e1fee216d"`);
        await queryRunner.query(`ALTER TABLE "historial_equipo" DROP CONSTRAINT "FK_91027bbe7709ade7d7c16b16ac3"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_c39d3171e475b484753bb4b2e18"`);
        await queryRunner.query(`ALTER TABLE "ensayos" DROP COLUMN "imagenesGraficos"`);
        await queryRunner.query(`DROP TABLE "informes"`);
        await queryRunner.query(`DROP TYPE "public"."informes_estado_enum"`);
        await queryRunner.query(`DROP TABLE "historial_equipo"`);
        await queryRunner.query(`DROP TYPE "public"."historial_equipo_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "equipos"`);
        await queryRunner.query(`DROP TYPE "public"."equipos_estado_enum"`);
    }

}
