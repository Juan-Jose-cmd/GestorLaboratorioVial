import { v2 as cloudinary } from 'cloudinary';
import { envs } from './envs';

export const CloudinaryConfig = {
  provide: 'CLAUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envs.CLOUDINARY_CLOUD_NAME,
      api_key: envs.CLOUDINARY_CLOUD_KEY,
      api_secret: envs.CLOUDINARY_CLOUD_SECRET,
    });
  },
};