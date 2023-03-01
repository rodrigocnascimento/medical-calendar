import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";

import { INestApplication, UnprocessableEntityException } from "@nestjs/common";

import { build as medicalAppointmentMock } from "../test/mocks/medical_appointment.mock";
import { build as userMock } from "../test/mocks/users.mock";
import { build as patientMock } from "../test/mocks/patients.mock";

import { closeE2ETests, setupE2EDB, testDatabaseConfigs } from "../database/test-datasource.config";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { Patient } from "../patients/patient.entity";
import { MedicalAppointmentsModule } from "./medical_appointments.module";
import { UsersModule } from "../users/users.module";
import { PatientsModule } from "../patients/patients.module";
import { MedicalAppointmentsService } from "./medical_appointments.service";
import { CreateMedicalAppointmentDto } from "./dto/create.dto";

jest.setTimeout(30000);

let app: INestApplication;
let medAppService: MedicalAppointmentsService;
let userRepo: Repository<User>;
let patientRepo: Repository<Patient>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MedicalAppointmentsModule,
      UsersModule,
      PatientsModule,
      TypeOrmModule.forRoot(testDatabaseConfigs),
    ],
  }).compile();

  app = module.createNestApplication();

  await app.init();

  userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  patientRepo = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  medAppService = await module.resolve<MedicalAppointmentsService>(MedicalAppointmentsService);
});

beforeEach(async () => {
  await setupE2EDB(false);
});

afterEach(async () => {
  await closeE2ETests();
});

afterAll(async () => {
  await app.close();
});

describe("Medical Appointments integration Tests", () => {
  it("Should throw an error when trying to save two patients in the same hour", async () => {
    const doctor = userMock();
    const [patient1, patient2] = patientMock({
      quantityToGenerate: 2,
    }) as Patient[];
    // new Date(year, monthIndex, day, hours)
    const appointmentDate = new Date(2023, 1, 28, 19, 58);
    const nextAppointmentDate = new Date(2023, 1, 28, 19, 58);

    await userRepo.save(doctor);
    await patientRepo.save(patient1);
    await patientRepo.save(patient2);

    const firstMedicalApp = medicalAppointmentMock({
      customData: {
        doctor: doctor["id"],
        patient: patient1["id"] as unknown as Patient,
        date: appointmentDate,
      },
    }) as unknown as CreateMedicalAppointmentDto;

    await medAppService.create(firstMedicalApp);

    const secondMedicalApp = medicalAppointmentMock({
      customData: {
        doctor: doctor["id"],
        patient: patient2["id"] as unknown as Patient,
        date: nextAppointmentDate,
        createdAt: new Date(),
      },
    }) as unknown as CreateMedicalAppointmentDto;

    expect(async () => await medAppService.create(secondMedicalApp)).rejects.toThrow(
      new UnprocessableEntityException("Já tem uma consulta nesse horário.")
    );
  });

  it("Should create when the appointment dates is not the same range hours", async () => {
    const doctor = userMock();
    const [patient1, patient2, patient3] = patientMock({
      quantityToGenerate: 3,
    }) as Patient[];
    // new Date(year, monthIndex, day, hours)
    const appointmentDate = new Date(2023, 1, 28, 19, 30);
    const nextAppointmentDate = new Date(2023, 1, 28, 20, 31);
    const nextAppointmentDate2 = new Date(2023, 1, 28, 21, 32);

    await userRepo.save(doctor);
    await patientRepo.save(patient1);
    await patientRepo.save(patient2);

    const firstMedicalApp = medicalAppointmentMock({
      customData: {
        doctor: doctor["id"],
        patient: patient1["id"] as unknown as Patient,
        date: appointmentDate,
      },
    }) as unknown as CreateMedicalAppointmentDto;

    const secondMedicalApp = medicalAppointmentMock({
      customData: {
        doctor: doctor["id"],
        patient: patient2["id"] as unknown as Patient,
        date: nextAppointmentDate,
        createdAt: new Date(),
      },
    }) as unknown as CreateMedicalAppointmentDto;

    const thirdMedicalApp = medicalAppointmentMock({
      customData: {
        doctor: doctor["id"],
        patient: patient3["id"] as unknown as Patient,
        date: nextAppointmentDate2,
        createdAt: new Date(),
      },
    }) as unknown as CreateMedicalAppointmentDto;

    await medAppService.create(firstMedicalApp);
    await medAppService.create(secondMedicalApp);
    await medAppService.create(thirdMedicalApp);

    const appointments = await medAppService.findAll();

    expect(appointments.length).toEqual(3);
  });
});
