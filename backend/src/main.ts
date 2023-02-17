import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const serverPort = process.env.PORT || 3000;

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
  await app.listen(serverPort);
}
bootstrap();
