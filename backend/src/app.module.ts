import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientsModule } from './patients/patient.module';
import { setEnvironment } from './env';
import typeormConfig from './database/typeorm.config';

@Module({
  imports: [
    PatientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    TypeOrmModule.forRoot(typeormConfig),
  ],
})
export class AppModule {}
