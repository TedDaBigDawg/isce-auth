import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'https://events-nestjs.onrender.com', 'https://isceauth.onrender.com'], // Frontend URLs
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Include 'Authorization' if needed
    credentials: true, // Allow cookies and authorization headers
  });


  const config = new DocumentBuilder()
    .setTitle('ISCE AUTH')
    .setDescription('Authentication for ISCE product')
    .setVersion('1.0')
    .addTag('ISCE')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT' 
      }, 
      'JWT-auth' // The name used to reference this auth method in the Swagger UI
    )
    .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);

  await app.listen(3223);
}
bootstrap();
