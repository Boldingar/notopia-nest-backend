import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
