import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './envs';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false, 
    logging: false,
    entities: ["src/modules/**/*.entity.ts"],
    subscribers: [],
    migrations: ["src/infra/db/migrations/*.ts"],
    // dropSchema: true,
});