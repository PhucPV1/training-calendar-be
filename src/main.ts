import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Swagger from './plugins/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    optionsSuccessStatus: 204,
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'Credentials',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Authorization',
      'Accept',
      'Observe',
      'Method',
      'Methods',
      'Access-Control-Allow-Methods',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });
  app.setGlobalPrefix('api/v1');
  Swagger(app);
  await app.listen(4000);
}
bootstrap();
