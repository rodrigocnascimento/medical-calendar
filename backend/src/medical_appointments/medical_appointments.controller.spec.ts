import { Test, TestingModule } from "@nestjs/testing";
import { MedicalAppointmentsController } from "./medical_appointments.controller";
import { MedicalAppointmentsService } from "./medical_appointments.service";

import { MedicalAppointmentRepository } from "./medical_appointments.repository";

describe("MedicalAppointmentsController", () => {
  let controller: MedicalAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalAppointmentsController],
      providers: [
        MedicalAppointmentsService,
        {
          provide: MedicalAppointmentRepository, // getRepositoryToken(MedicalAppointment),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            alreadyHasAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MedicalAppointmentsController>(MedicalAppointmentsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
