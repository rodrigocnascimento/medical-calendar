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

import { PatientVM } from './patient.vm';
import { NotFoundError } from 'src/errors/NotFound.error';
import { BadRequestError } from 'src/errors/BadRequest.error';
import { PatientService } from './patient.service';
import { CreatePatientDTO } from './dto/create.dto';
import { UpdatePatientDTO } from './dto/update.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Busca um paciente pelo seu id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'O Id do paciente',
  })
  @ApiOkResponse({ description: 'Paciente encontrado.', type: PatientVM })
  @ApiNotFoundResponse({
    description: 'Paciente não econtrado.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<PatientVM> {
    const patient = await this.patientService.findOne(id);

    return PatientVM.toViewModel(patient);
  }

  @Get()
  @ApiOperation({
    summary: 'Encontra todos os pacientes',
  })
  @ApiOkResponse({
    description: 'Todos os pacientes encontrados.',
    type: [PatientVM],
  })
  async getAll(): Promise<PatientVM[]> {
    const patients = await this.patientService.findAll();

    return patients.map((patient) => PatientVM.toViewModel(patient));
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
  ): Promise<PatientVM> {
    const newPatient = await this.patientService.save(
      PatientVM.fromViewModel<CreatePatientDTO>(createPatient),
    );

    return PatientVM.toViewModel(newPatient);
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
  async uopdatePatient(
    @Body() updatePatient: UpdatePatientDTO,
  ): Promise<PatientVM | UpdateResult> {
    const affectedPatient = await this.patientService.update(
      PatientVM.fromViewModel(updatePatient),
    );

    if (affectedPatient instanceof PatientVM) {
      return PatientVM.toViewModel(affectedPatient);
    }

    return affectedPatient as UpdateResult;
  }
}
