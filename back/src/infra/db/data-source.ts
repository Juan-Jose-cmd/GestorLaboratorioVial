import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './envs';

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    subscribers: [],
    // dropSchema: true,
    entities: [
        __dirname + "/../../modules/**/*.entity.{ts,js}"
    ],
    migrations: [
        __dirname + "/../migrations/*.{ts,js}"
    ],
    // subscribers: [],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
    extra: {
        max: process.env.NODE_ENV === 'production' ? 20 : 10,
        connectionTimeoutMillis: 5000,
    }
});

export const testConnection = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Conectado a PostgreSQL:', {
            host: DB_HOST,
            database: DB_NAME,
            user: DB_USER
        });
        return true;
    } catch (error) {
        console.error('Error conectando a PostgreSQL:', error);
        return false;
    }
};
