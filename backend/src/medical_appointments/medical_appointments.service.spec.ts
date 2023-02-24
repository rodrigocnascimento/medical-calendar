import { Test, TestingModule } from "@nestjs/testing";
import { MedicalAppointmentsService } from "./medical_appointments.service";
import { MedicalAppointment } from "./medical_appointments.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MedicalAppointmentRepository } from "./medical_appointments.repository";
import { build as medicalAppointmentMock } from "../test/mocks/medical_appointment.mock";
import { CreateMedicalAppointmentDto } from "./dto/create.dto";
import { Patient } from "../patients/patient.entity";
import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

describe("MedicalAppointmentsService", () => {
  let service: MedicalAppointmentsService;
  let repo: MedicalAppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalAppointmentsService,
        {
          provide: getRepositoryToken(MedicalAppointmentRepository), //getRepositoryToken(MedicalAppointment),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            alreadyHasAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MedicalAppointmentsService>(MedicalAppointmentsService);
    repo = module.get<MedicalAppointmentRepository>(
      getRepositoryToken(MedicalAppointmentRepository)
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it("Should create a patient an return itself", async () => {
    const appointment = medicalAppointmentMock({
      customData: {
        patient: "32a71c0a-0b5d-4c4d-8495-e305c90c90f1" as unknown as Patient,
      },
    }) as MedicalAppointment;

    const appointmentRequest = {
      patient: "32a71c0a-0b5d-4c4d-8495-e305c90c90f1",
      date: "2023-07-23T22:53:23.335Z",
    } as unknown as CreateMedicalAppointmentDto;

    jest.spyOn(repo, "findOne").mockResolvedValue(appointment);
    jest.spyOn(repo, "save").mockResolvedValue(appointment);

    const reservedAppointment = await service.create(appointmentRequest);

    expect(reservedAppointment.patient).toEqual(appointmentRequest.patient);
  });

  it("Should throw an error if a patient id already exists", async () => {
    const appointmentRequest = {
      patient: "32a71c0a-0b5d-4c4d-8495-e305c90c90f1",
      date: "2023-07-23T22:53:23.335Z",
    } as unknown as CreateMedicalAppointmentDto;

    jest.spyOn(repo, "save").mockRejectedValue(new QueryFailedError("failed query", [], "driver"));

    expect(async () => await service.create(appointmentRequest)).rejects.toThrow(
      new NotFoundException("Paciente não encontrado.")
    );
  });

  it("Should save an appointment if it don't have a appointment on the same time", async () => {
    const appointmentRequest = {
      patient: "32a71c0a-0b5d-4c4d-8495-e305c90c90f1",
      date: "2023-07-23T22:53:23.335Z",
    } as unknown as CreateMedicalAppointmentDto;

    const appointment = medicalAppointmentMock({
      customData: {
        date: appointmentRequest.date,
      },
    }) as MedicalAppointment;

    jest.spyOn(repo, "alreadyHasAppointment").mockResolvedValue(false);
    appointment.patient = { id: appointmentRequest.patient } as Patient;
    jest.spyOn(repo, "save").mockResolvedValue(appointment);

    const appointmentResult = await service.create(appointmentRequest);

    expect(appointmentResult.date).toEqual("2023-07-23T22:53:23.335Z");
    expect(appointmentResult.patient.id).toEqual("32a71c0a-0b5d-4c4d-8495-e305c90c90f1");
  });

  it("Should throw an error if already has an appointment in the same date", async () => {
    const appointmentRequest = {
      patient: "32a71c0a-0b5d-4c4d-8495-e305c90c90f1",
      date: "2023-07-23T22:53:23.335Z",
    } as unknown as CreateMedicalAppointmentDto;

    jest.spyOn(repo, "alreadyHasAppointment").mockRejectedValue(new UnprocessableEntityException());

    expect(async () => await service.create(appointmentRequest)).rejects.toThrow(
      new UnprocessableEntityException("Já tem uma consulta nesse horário.")
    );
  });
});
