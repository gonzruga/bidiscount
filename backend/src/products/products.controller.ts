import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service.js';
import { ImageUploadService } from './image-upload.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    // private readonly imageUploadService: ImageUploadService,
  ) {}

  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.create(createProductDto);
  // }

  
  // @Post('upload-image')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )  
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() image?: Express.Multer.File) {
    return this.productsService.create(createProductDto, image);
  }


  //     fileFilter: (req, file, callback) => {
  //       const allowedExtensions = [
  //         '.jpg',
  //         '.jpeg',
  //         '.png',
  //         '.webp',
  //         '.gif',
  //       ];

  //       const extension = file.originalname
  //         .substring(file.originalname.lastIndexOf('.'))
  //         .toLowerCase();

  //       const isImageMimeType = file.mimetype.startsWith('image/');
  //       const isOctetStream =
  //         file.mimetype === 'application/octet-stream';

  //       const isValidExtension =
  //         allowedExtensions.includes(extension);

  //       if (
  //         isImageMimeType ||
  //         (isOctetStream && isValidExtension)
  //       ) {
  //         callback(null, true);
  //       } else {
  //         callback(
  //           new BadRequestException(
  //             `Only image files are allowed. Received: ${file.mimetype}`,
  //           ),
  //           false,
  //         );
  //       }
  //     },
  //   }),
  // )
  // async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.imageUploadService.uploadImage(file);
  // }


  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(
      id,
      updateProductDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}