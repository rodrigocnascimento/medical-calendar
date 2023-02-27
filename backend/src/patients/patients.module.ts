import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "./patient.entity";
import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { PatientsRepository } from "./patients.repository";
import { CryptoService } from "../crypto.service";

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository, CryptoService],
  exports: [PatientsService],
})
export class PatientsModule {}
