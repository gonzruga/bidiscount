import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { OffersModule } from './offers/offers.module.js';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), ProductsModule, PrismaModule, CloudinaryModule, OffersModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
