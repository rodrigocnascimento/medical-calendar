import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  UnprocessableEntityException,
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
} from '@nestjs/swagger';

import { PatientsVM } from './patients.vm';
import { NotFoundError } from '../errors/NotFound.error';
import { BadRequestError } from '../errors/BadRequest.error';
import { PatientsService } from './patients.service';
import { CreatePatientDTO } from './dto/create.dto';
import { UpdatePatientDTO } from './dto/update.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Busca um paciente pelo seu id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'O Id do paciente',
  })
  @ApiOkResponse({ description: 'Paciente encontrado.', type: PatientsVM })
  @ApiNotFoundResponse({
    description: 'Paciente não econtrado.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<PatientsVM> {
    const patient = await this.patientService.findOne(id);

    return PatientsVM.toViewModel(patient);
  }

  @Get()
  @ApiOperation({
    summary: 'Encontra todos os pacientes',
  })
  @ApiOkResponse({
    description: 'Todos os pacientes encontrados.',
    type: [PatientsVM],
  })
  async getAll(): Promise<PatientsVM[]> {
    const patients = await this.patientService.findAll();

    return patients.map((patient) => PatientsVM.toViewModel(patient));
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
  ): Promise<PatientsVM> {
    const newPatient = await this.patientService.save(
      PatientsVM.fromViewModel<CreatePatientDTO>(createPatient),
    );

    return PatientsVM.toViewModel(newPatient);
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
  ): Promise<PatientsVM | UpdateResult> {
    const affectedPatient = await this.patientService.update(
      PatientsVM.fromViewModel(updatePatient),
    );

    if (affectedPatient instanceof PatientsVM) {
      return PatientsVM.toViewModel(affectedPatient);
    }

    return affectedPatient as UpdateResult;
  }
}
