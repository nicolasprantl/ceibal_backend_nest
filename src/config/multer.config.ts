// config/multer.config.ts
import multer, { memoryStorage } from 'multer';
import { Request } from 'express';

export const multerOptions = {
  storage: memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|mp4|mov|avi)$/)) {
      callback(null, true);
    } else {
      callback(new Error('Unsupported file type') as any, false);
    }
  },
};
