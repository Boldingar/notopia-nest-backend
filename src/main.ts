import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve static files from the 'images/categories' folder
  app.use(
    '/images/categories',
    express.static(join(__dirname, '..', 'src', 'images', 'categories')),
  );

  app.enableCors();

  // Swagger configuration
  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'Bearer',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'thisIsASampleBearerAuthToken123',
        },
      },
    },
  };

  const config = new DocumentBuilder()
    .setTitle('Notopia API')
    .addBearerAuth(undefined, 'Bearer')
    .setDescription('The Notopia API description')
    .setVersion('1.0')
    .addTag('notopia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);

  await app.listen(3000);
}
bootstrap();
