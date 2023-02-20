import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotFoundError } from '../errors/NotFound.error';
import { UUIDVersion } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('MedicalRegistries')
@Controller('medical-registries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
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
  @ApiOperation({
    summary: 'Atualiza um registro médico para um paciente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'O Id do registro.',
    example: 'ae9b25d0-5f9f-4b28-99cb-999cc4cd4a60',
  })
  @ApiCreatedResponse({
    description: 'Registro médico da consulta atualizado.',
    type: MedicalRegistryDTO,
  })
  @ApiNotFoundResponse({
    description: 'Consulta não econtrada.',
    type: NotFoundError,
  })
  update(
    @Param('id') id: UUIDVersion,
    @Body() updateMedicalRegistryDto: UpdateMedicalRegistryDTO,
  ) {
    return this.medicalRegistriesService.update(id, updateMedicalRegistryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove um registro médico para um paciente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'O Id do registro.',
    example: 'ae9b25d0-5f9f-4b28-99cb-999cc4cd4a60',
  })
  @ApiCreatedResponse({
    description: 'Registro médico da consulta atualizado.',
    type: MedicalRegistryDTO,
  })
  @ApiNotFoundResponse({
    description: 'Consulta não econtrada.',
    type: NotFoundError,
  })
  remove(@Param('id') id: UUIDVersion) {
    return this.medicalRegistriesService.remove(id);
  }
}
