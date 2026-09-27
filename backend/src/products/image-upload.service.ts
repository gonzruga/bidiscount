import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import type { Express } from 'express';

import cloudinary from '../cloudinary/cloudinary.config.js';

@Injectable()
export class ImageUploadService {
async uploadImage(file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('Image file is required');
  }

  console.log('Uploaded file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

     const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif',
    ];

    const extension = file.originalname
      .substring(file.originalname.lastIndexOf('.'))
      .toLowerCase();

    const isImageMimeType =
      file.mimetype.startsWith('image/');

    const isOctetStream =
      file.mimetype === 'application/octet-stream';

    const isValidExtension =
      allowedExtensions.includes(extension);

    if (
      !isImageMimeType &&
      !(isOctetStream && isValidExtension)
    ) {
      throw new BadRequestException(
        `Only image files are allowed. Received: ${file.mimetype}`,
      );
    }
  return new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bidiscount/products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          reject(
            new BadRequestException(error?.message || 'Image upload failed'),
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(file.buffer);
  });
}
}