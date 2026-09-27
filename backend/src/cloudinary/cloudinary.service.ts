import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import cloudinary from './cloudinary.config.js';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Image file is required',
      );
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Only image files are allowed',
      );
    }

    return new Promise<{
      url: string;
      publicId: string;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: 'bidiscount/products',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) {
              reject(
                new BadRequestException(
                  'Image upload failed',
                ),
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