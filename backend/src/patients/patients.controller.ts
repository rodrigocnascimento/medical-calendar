import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { NotFoundError } from '../errors/NotFound.error';
import { BadRequestError } from '../errors/BadRequest.error';
import { PatientsService } from './patients.service';
import { CreatePatientDTO } from './dto/create.dto';
import { UpdatePatientDTO } from './dto/update.dto';
import { PatientsDTO } from './dto/patient.dto';
import { UpdateResult } from 'typeorm';
import { Patient } from './patient.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Busca um paciente pelo seu id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'O Id do paciente',
  })
  @ApiOkResponse({
    description: 'Paciente encontrado.',
    type: PatientsDTO,
  })
  @ApiNotFoundResponse({
    description: 'Paciente não econtrado.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Encontra todos os pacientes',
  })
  @ApiOkResponse({
    description: 'Todos os pacientes encontrados.',
    type: [PatientsDTO],
  })
  async getAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Cria um paciente',
  })
  @ApiCreatedResponse({
    description: 'Paciente criado.',
    type: CreatePatientDTO,
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async createPatient(
    @Body() createPatient: CreatePatientDTO,
  ): Promise<Patient> {
    const newPatient = await this.patientService.save(createPatient);

    return newPatient;
  }

  @Patch()
  @ApiOperation({
    summary: 'Edita um paciente',
  })
  @ApiResponse({
    description: 'Paciente atualizado.',
    type: UpdatePatientDTO,
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async updatePatient(
    @Body() updatePatient: UpdatePatientDTO,
  ): Promise<Patient | UpdateResult> {
    return this.patientService.update(updatePatient);
  }
}
