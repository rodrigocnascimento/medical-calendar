import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicalRegistriesService } from './medical_registries.service';
import { CreateMedicalRegistryDTO } from './dto/create.dto';
import { UpdateMedicalRegistryDTO } from './dto/update.dto';
import { MedicalRegistryDTO } from './dto/medical_registry.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundError } from '../errors/NotFound.error';
import { UUIDVersion } from 'class-validator';

@ApiTags('MedicalRegistries')
@Controller('medical-registries')
export class MedicalRegistriesController {
  constructor(
    private readonly medicalRegistriesService: MedicalRegistriesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um registro médico para um paciente.',
  })
  @ApiProperty({
    description: 'Test',
    type: CreateMedicalRegistryDTO,
  })
  @ApiCreatedResponse({
    description: 'Registro médico da consulta criado.',
    type: MedicalRegistryDTO,
  })
  @ApiNotFoundResponse({
    description: 'Consulta não econtrada.',
    type: NotFoundError,
  })
  create(@Body() createMedicalRegistryDto: CreateMedicalRegistryDTO) {
    return this.medicalRegistriesService.create(createMedicalRegistryDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: UUIDVersion,
    @Body() updateMedicalRegistryDto: UpdateMedicalRegistryDTO,
  ) {
    return this.medicalRegistriesService.update(id, updateMedicalRegistryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUIDVersion) {
    return this.medicalRegistriesService.remove(id);
  }
}
