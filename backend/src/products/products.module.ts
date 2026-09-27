import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
// import { ImageUploadService } from './image-upload.service.js';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService,  
    // ImageUploadService,
  ],
})
export class ProductsModule {}

// We don't need to add CloudinaryService here because CloudinaryModule is globally imported in the AppModule, and NestJS will handle the dependency injection automatically.