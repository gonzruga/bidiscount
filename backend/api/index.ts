import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://bidiscount-kxy5.vercel.app',
      ],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  }

  return app;
}

export default async function handler(req: any, res: any) {
  const application = await createApp();

  const expressApp =
    application.getHttpAdapter().getInstance();

  return expressApp(req, res);
}