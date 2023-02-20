import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRegistriesService } from './medical_registries.service';
import { MedicalRegistry } from './medical_registry.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MedicalRegistriesService', () => {
  let service: MedicalRegistriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<MedicalRegistriesService>(MedicalRegistriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
