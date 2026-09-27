import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend application running on http://localhost:3000
  // Allow both local frontend and production frontend to call the API.
  app.enableCors({
    origin: ['http://localhost:3000',
    'https://bidiscount-kxy5.vercel.app',]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

await bootstrap();