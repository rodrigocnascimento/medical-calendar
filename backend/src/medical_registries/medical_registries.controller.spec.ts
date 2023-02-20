import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRegistriesController } from './medical_registries.controller';
import { MedicalRegistriesService } from './medical_registries.service';
import { MedicalRegistry } from './medical_registry.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MedicalRegistriesController', () => {
  let controller: MedicalRegistriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRegistriesController],
      providers: [
        MedicalRegistriesService,
        {
          provide: getRepositoryToken(MedicalRegistry),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MedicalRegistriesController>(
      MedicalRegistriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
