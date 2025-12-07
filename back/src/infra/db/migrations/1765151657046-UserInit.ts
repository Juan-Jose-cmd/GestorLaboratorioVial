import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInit1765151657046 implements MigrationInterface {
    name = 'UserInit1765151657046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ensayos_estado_enum" AS ENUM('pendiente', 'en_proceso', 'finalizado')`);
        await queryRunner.query(`CREATE TABLE "ensayos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "datos" jsonb NOT NULL, "estado" "public"."ensayos_estado_enum" NOT NULL DEFAULT 'pendiente', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "obraId" uuid NOT NULL, "solicitudId" uuid NOT NULL, "laboratoristaId" uuid NOT NULL, CONSTRAINT "REL_89ce9f68cad83fb37336725fbb" UNIQUE ("solicitudId"), CONSTRAINT "PK_de4c968a3f11760c94a16397f77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ensayos" ADD CONSTRAINT "FK_e278579d79b84e99abcb9688c8f" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ensayos" ADD CONSTRAINT "FK_89ce9f68cad83fb37336725fbb7" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ensayos" ADD CONSTRAINT "FK_324a1938d417b12abc73be92f88" FOREIGN KEY ("laboratoristaId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ensayos" DROP CONSTRAINT "FK_324a1938d417b12abc73be92f88"`);
        await queryRunner.query(`ALTER TABLE "ensayos" DROP CONSTRAINT "FK_89ce9f68cad83fb37336725fbb7"`);
        await queryRunner.query(`ALTER TABLE "ensayos" DROP CONSTRAINT "FK_e278579d79b84e99abcb9688c8f"`);
        await queryRunner.query(`DROP TABLE "ensayos"`);
        await queryRunner.query(`DROP TYPE "public"."ensayos_estado_enum"`);
    }

}
