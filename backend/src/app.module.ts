import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PatientsModule } from "./patients/patients.module";
import { setEnvironment } from "./env";
import { MedicalAppointmentsModule } from "./medical_appointments/medical_appointments.module";
import { MedicalRegistriesModule } from "./medical_registries/medical_registries.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import typeormConfig from "./database/typeorm.config";
import { AppController } from "./app.controller";

@Module({
  imports: [
    PatientsModule,
    MedicalAppointmentsModule,
    MedicalRegistriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
