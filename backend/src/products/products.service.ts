import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto,image?: Express.Multer.File,) {
    let imageUrl: string | undefined;

    if (image) {
      const uploadResult = await this.cloudinary.uploadImage(image);
      imageUrl = uploadResult.url;
    }

    return this.prisma.product.create({
      data: {
        itemName: createProductDto.itemName,
        description: createProductDto.description,
        shop: createProductDto.shop,
        originalPrice: createProductDto.originalPrice,
        image: imageUrl,
        status: createProductDto.status,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}