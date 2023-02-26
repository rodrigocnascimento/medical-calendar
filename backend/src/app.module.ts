import { Module, Scope } from "@nestjs/common";
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
import { APP_FILTER } from "@nestjs/core";
import { GlobalCatcher, HttpErrorFilter } from "./filter-error.http";

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
  providers: [
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: GlobalCatcher,
    },
  ],
})
export class AppModule {}
