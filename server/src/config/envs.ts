import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const envs = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,

  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_KEY: process.env.CLOUDINARY_CLOUD_KEY,
  CLOUDINARY_CLOUD_SECRET: process.env.CLOUDINARY_CLOUD_SECRET,

  JWT_SECRET: process.env.JWT_SECRET,

  MAIL_PROVIDER: process.env.MAIL_PROVIDER || 'log',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM || 'notificaciones@laboratorio.com',
};
