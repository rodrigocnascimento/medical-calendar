import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientsModule } from './patients/patients.module';
import { setEnvironment } from './env';
import { MedicalAppointmentsModule } from './medical_appointments/medical_appointments.module';
import typeormConfig from './database/typeorm.config';

@Module({
  imports: [
    PatientsModule,
    MedicalAppointmentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    TypeOrmModule.forRoot(typeormConfig),
  ],
})
export class AppModule {}
