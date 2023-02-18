import { TestingModule, Test } from '@nestjs/testing';
import { PatientsRepository } from './patients.repository';
import { PatientsService } from './patients.service';
import { build as patientMock } from '../test/mocks/patients.mock';
import { Patient } from './patient.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePatientDTO } from './dto/create.dto';
import { UpdateResult } from 'typeorm';
import { UpdatePatientDTO } from './dto/update.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let patientsRepository: PatientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    patientsRepository = module.get<PatientsRepository>(
      getRepositoryToken(Patient),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientsRepository).toBeDefined();
  });

  it('Should get a list of patients', async () => {
    const patient = patientMock({
      quantityToGenerate: 3,
    }) as unknown as Promise<Patient[]>;

    jest.spyOn(patientsRepository, 'find').mockResolvedValue(patient);

    const patientsList = await service.findAll();

    expect(patientsRepository.find).toBeCalled();

    expect(patientsList.length).toBeGreaterThanOrEqual(3);
  });

  it('Should return a patient based on his ID', async () => {
    const patient = patientMock() as Patient;

    jest.spyOn(patientsRepository, 'findOneOrFail').mockResolvedValue(patient);

    await service.findOne(patient.id);

    expect(patientsRepository.findOneOrFail).toBeCalledWith({
      where: {
        id: patient.id,
      },
      relations: ['appointments'],
    });
  });

  it('Should throw an error if the patient was not found', async () => {
    const patient = patientMock() as Patient;

    jest
      .spyOn(patientsRepository, 'findOneOrFail')
      .mockRejectedValue(new NotFoundException('Paciente não encontrado.'));

    expect(async () => await service.findOne(patient.id)).rejects.toThrow(
      new NotFoundException('Paciente não encontrado.'),
    );
  });

  it('Should create a patient an return itself', async () => {
    const patient = patientMock() as CreatePatientDTO;

    jest.spyOn(patientsRepository, 'save').mockResolvedValue(patient);

    const createdPatient = await service.save(patient);

    expect(patientsRepository.save).toBeCalledWith({ ...patient });
    expect(createdPatient).toStrictEqual(patient);
  });

  it('Should throw an error if a patient email already exists', async () => {
    const patient = patientMock() as CreatePatientDTO;

    jest.spyOn(service, 'getEmailOrFail').mockResolvedValue(patient);

    expect(async () => await service.save(patient)).rejects.toThrow(
      new UnprocessableEntityException('Email de paciente já cadastrado.'),
    );

    expect(service.getEmailOrFail).toBeCalledWith(patient.email);
  });

  it('Should return the user when its searched by its email', async () => {
    const emailInput = 'email_de_teste@email.com';
    const patient = patientMock({
      customData: {
        email: emailInput,
      },
    }) as Patient;

    jest.spyOn(patientsRepository, 'findOne').mockResolvedValue(patient);

    const patientByEmail = await service.getEmailOrFail(emailInput);

    expect(patientsRepository.findOne).toBeCalledWith({
      where: {
        email: emailInput,
      },
    });

    expect(patientByEmail.email).toEqual(patient.email);
  });

  it('Should update the user', async () => {
    const patient = patientMock() as Patient;
    const patient_ = patientMock({
      customData: {
        ...patient,
        id: patient.id,
        name: patient.name + ' Editado',
      },
    }) as UpdatePatientDTO;

    jest.spyOn(patientsRepository, 'findOne').mockResolvedValue(patient_);
    jest.spyOn(patientsRepository, 'update').mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    } as UpdateResult);

    const updatedPatient = (await service.update(patient_)) as Patient;

    expect(patientsRepository.findOne).toBeCalledWith({
      where: {
        id: patient.id,
      },
    });

    expect(patientsRepository.update).toBeCalledWith(patient.id, patient_);
    expect(updatedPatient.name).toEqual(patient_.name);
    expect(updatedPatient.id).toEqual(patient.id);
  });

  it('Should throw a NotFoundException if the user is not found when trying to update the user', async () => {
    const patient = patientMock() as UpdatePatientDTO;

    jest.spyOn(patientsRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(patientsRepository, 'update').mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 0,
    } as UpdateResult);

    expect(async () => await service.update(patient)).rejects.toThrow(
      new NotFoundException('Paciente não encontrado.'),
    );
  });
});
