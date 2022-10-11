import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default function Swagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Training Session Calendar API')
    .setDescription('Training Session Calendar API Description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description:
          'Example  ----> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMSwibmFtZSI6Im9rIiwiaWF0IjoxNjUzMjk5MDk4LCJleHAiOjE2NTMyOTk2OTh9.R9W-ZKJBYrnU-tOKVIEmMq6cuZGJ8IlMfjXGE2Qt2R0',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        description:
          'Example  ----> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI1LCJuYW1lIjoiS29kQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTQ3NzEzODUsImV4cCI6MTY1NTM3NjE4NX0.59os0u11Id3niUkcuW5X0IJHkJsF-SxoORyuz-LHB28',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'refresh-token',
    )
    .addCookieAuth('optional-session-id')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}
