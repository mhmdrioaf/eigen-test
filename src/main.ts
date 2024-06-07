import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription(
      'The Library Management API provides a comprehensive set of endpoints to manage library operations. This API allows users to borrow books, return books, check the availability of books, and verify library members. It aims to streamline the library management process and enhance the user experience for both library staff and members.',
    )
    .setVersion('1.0')
    .addTag('library')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
