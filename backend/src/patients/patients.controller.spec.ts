import { Test, TestingModule } from '@nestjs/testing';

import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { build as patientMock } from '../test/mocks/patients.mock';
import { Patient } from './patient.entity';
import { CreatePatientDTO } from './dto/create.dto';
import { UpdatePatientDTO } from './dto/update.dto';
import { PatientsVM } from './patients.vm';
describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  describe('PatientsController', () => {
    it('Service and Controller should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });

    it('Should return a list of patients', async () => {
      const patients = patientMock({
        quantityToGenerate: 3,
      }) as unknown as Promise<Patient[]>;

      jest.spyOn(service, 'findAll').mockResolvedValue(patients);

      await controller.getAll();

      expect(service.findAll).toBeCalled();
    });

    it('Should return a patient based on his ID', async () => {
      const patient = patientMock() as unknown as Patient;

      jest.spyOn(service, 'findOne').mockResolvedValue(patient);

      await controller.get(patient.id);

      expect(service.findOne).toBeCalledWith(patient.id);
    });

    it('Should create a patient and return the data', async () => {
      const patient = patientMock() as unknown as CreatePatientDTO;

      jest.spyOn(service, 'save').mockResolvedValue(patient);

      const returnedPatient = await controller.createPatient(patient);

      expect(service.save).toBeCalledWith(patient);
      expect(returnedPatient.id).toEqual(patient.id);
      expect(returnedPatient.name).toEqual(patient.name);
    });

    it('Should update a patient and return the data updated', async () => {
      const patient = patientMock() as Patient;
      const patient_ = patientMock({
        customData: { ...patient },
      }) as UpdatePatientDTO;

      patient_.name += ' Editado';

      jest.spyOn(service, 'update').mockResolvedValue(patient_);

      const returnedPatient = (await controller.updatePatient(
        patient_,
      )) as PatientsVM;

      expect(service.update).toBeCalledWith(patient_);
      expect(returnedPatient.name).toEqual(patient_.name);
      expect(returnedPatient.name).not.toEqual(patient.name);
    });
  });
});
