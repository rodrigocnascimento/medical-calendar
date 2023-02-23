import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const serverPort = process.env.PORT || 3000;
const version = process.env.npm_package_version;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors: Record<string, Array<string>> = {};

        errors.forEach((el) => {
          customErrors[el.property] = Object.values(el.constraints);
        });

        return new BadRequestException([customErrors]);
      },
    }),
  );

  //Swagger configurations
  const options = new DocumentBuilder()
    .setTitle('MedApp Medical Appointments')
    .setDescription('Sistema de prontuário eletrônico Médico')
    .setVersion(version)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, options));

  await app.listen(serverPort);
}

bootstrap();
