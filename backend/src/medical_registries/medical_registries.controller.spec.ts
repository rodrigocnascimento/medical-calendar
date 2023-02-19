import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRegistriesController } from './medical_registries.controller';
import { MedicalRegistriesService } from './medical_registries.service';

describe('MedicalRegistriesController', () => {
  let controller: MedicalRegistriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRegistriesController],
      providers: [MedicalRegistriesService],
    }).compile();

    controller = module.get<MedicalRegistriesController>(
      MedicalRegistriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
