import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as multer from 'multer';
// import { v4 as uuidv4 } from 'uuid';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/product');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `product-${uuidv4()}.${ext}`);
//   },
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Notopia API')
    .setDescription('The Notopia API description')
    .setVersion('1.0')
    .addTag('notopia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
