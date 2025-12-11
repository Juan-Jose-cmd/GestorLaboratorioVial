import dotenv from 'dotenv';

dotenv.config();

// Validar y exportar variables
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '5432';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'laboratorio_vial_db';

// Puerto de la aplicación
export const PORT = process.env.PORT || '8080';

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Validación en producción
if (process.env.NODE_ENV === 'production') {
    const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}