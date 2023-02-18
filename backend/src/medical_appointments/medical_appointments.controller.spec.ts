import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsController } from './medical_appointments.controller';
import { MedicalAppointmentsService } from './medical_appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicalAppointment } from './medical_appointments.entity';

describe('MedicalAppointmentsController', () => {
  let controller: MedicalAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalAppointmentsController],
      providers: [
        MedicalAppointmentsService,
        {
          provide: getRepositoryToken(MedicalAppointment),
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

    controller = module.get<MedicalAppointmentsController>(
      MedicalAppointmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
