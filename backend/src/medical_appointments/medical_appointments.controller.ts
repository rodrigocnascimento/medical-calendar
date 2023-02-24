import { Controller, Post, Body, Patch, Param, Delete, Get, UseGuards } from "@nestjs/common";
import { MedicalAppointmentsService } from "./medical_appointments.service";
import { CreateMedicalAppointmentDto } from "./dto/create.dto";
import { UpdateMedicalAppointmentDto } from "./dto/update.dto";
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { NotFoundError } from "../errors/NotFound.error";
import { MedicalAppointmentDTO } from "./dto/medical_appointments.dto";
import { UUIDVersion } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt.guard";

@ApiTags("MedicalAppointments")
@Controller("medical-appointments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
export class MedicalAppointmentsController {
  constructor(private readonly medicalAppointmentsService: MedicalAppointmentsService) {}

  @Post()
  @ApiOperation({
    summary: "Reserva uma consulta para um paciente",
  })
  @ApiCreatedResponse({
    description: "Reserva da consulta.",
    type: MedicalAppointmentDTO,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: NotFoundError,
  })
  create(@Body() createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    return this.medicalAppointmentsService.create(createMedicalAppointmentDto);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Atualiza a reserva de uma consulta para um paciente",
  })
  @ApiParam({
    name: "id",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
    description: "O Id da consulta",
  })
  @ApiCreatedResponse({
    description: "Reserva da consulta.",
    type: MedicalAppointmentDTO,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: NotFoundError,
  })
  update(
    @Param("id") id: UUIDVersion,
    @Body() updateMedicalAppointmentDto: UpdateMedicalAppointmentDto
  ) {
    return this.medicalAppointmentsService.update(id, updateMedicalAppointmentDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Exclui a reserva de uma consulta para um paciente",
  })
  @ApiParam({
    name: "id",
    type: MedicalAppointmentDTO["id"],
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
    description: "O Id da consulta",
  })
  @ApiNotFoundResponse({
    description: "Agendamento de consulta não econtrado.",
    type: NotFoundError,
  })
  remove(@Param("id") id: UUIDVersion) {
    return this.medicalAppointmentsService.remove(id);
  }

  @ApiOperation({
    summary: "Retorna todas as reserva de todas as consultas.",
  })
  @ApiResponse({
    description: "Reserva da consulta.",
    type: MedicalAppointmentDTO,
  })
  @ApiNotFoundResponse({
    description: "Agendamento de consulta não econtrado.",
    type: NotFoundError,
  })
  @Get()
  findAll() {
    return this.medicalAppointmentsService.findAll();
  }

  @ApiOperation({
    summary: "Retorna todas as reserva de um médico.",
  })
  @ApiResponse({
    description: "Reserva da consulta.",
    type: MedicalAppointmentDTO,
  })
  @ApiNotFoundResponse({
    description: "Agendamento de consulta não econtrado.",
    type: NotFoundError,
  })
  @Get("/by-doctor")
  findAllByDoctor() {
    return this.medicalAppointmentsService.findAllByDoctor();
  }
}
