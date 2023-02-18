import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalAppointmentsService } from './medical_appointments.service';
import { CreateMedicalAppointmentDto } from './dto/create.dto';
import { UpdateMedicalAppointmentDto } from './dto/update.dto';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { NotFoundError } from '../errors/NotFound.error';
import { MedicalAppointmentDto } from './dto/medical_appointments.dto';
import { UUIDVersion } from 'class-validator';

@ApiTags('MedicalAppointments')
@Controller('medical-appointments')
export class MedicalAppointmentsController {
  constructor(
    private readonly medicalAppointmentsService: MedicalAppointmentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Reserva uma consulta para um paciente',
  })
  @ApiCreatedResponse({
    description: 'Reserva da consulta.',
    type: MedicalAppointmentDto,
  })
  @ApiNotFoundResponse({
    description: 'Paciente não econtrado.',
    type: NotFoundError,
  })
  create(@Body() createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    return this.medicalAppointmentsService.create(createMedicalAppointmentDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza a reserva de uma consulta para um paciente',
  })
  @ApiParam({
    name: 'id',
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
    description: 'O Id da consulta',
  })
  @ApiCreatedResponse({
    description: 'Reserva da consulta.',
    type: MedicalAppointmentDto,
  })
  @ApiNotFoundResponse({
    description: 'Paciente não econtrado.',
    type: NotFoundError,
  })
  update(
    @Param('id') id: UUIDVersion,
    @Body() updateMedicalAppointmentDto: UpdateMedicalAppointmentDto,
  ) {
    return this.medicalAppointmentsService.update(
      id,
      updateMedicalAppointmentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Exclui a reserva de uma consulta para um paciente',
  })
  @ApiParam({
    name: 'id',
    type: MedicalAppointmentDto['id'],
    example: '296317cd-e432-4f97-82b0-eadcfb02d642',
    description: 'O Id da consulta',
  })
  @ApiNotFoundResponse({
    description: 'Agendamento de consulta não econtrado.',
    type: NotFoundError,
  })
  remove(@Param('id') id: UUIDVersion) {
    return this.medicalAppointmentsService.remove(id);
  }
}
