import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRegistriesService } from './medical_registries.service';

describe('MedicalRegistriesService', () => {
  let service: MedicalRegistriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalRegistriesService],
    }).compile();

    service = module.get<MedicalRegistriesService>(MedicalRegistriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
