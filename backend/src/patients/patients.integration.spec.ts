import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";

import { INestApplication } from "@nestjs/common";

import { build as patientMock } from "../test/mocks/patients.mock";

import { closeE2ETests, setupE2EDB, testDatabaseConfigs } from "../database/test-datasource.config";
import { Repository } from "typeorm";

import { Patient } from "../patients/patient.entity";

import { PatientsModule } from "../patients/patients.module";
import { PatientsService } from "./patients.service";

jest.setTimeout(30000);

let app: INestApplication;
let patientService: PatientsService;
let patientRepo: Repository<Patient>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [PatientsModule, TypeOrmModule.forRoot(testDatabaseConfigs)],
  }).compile();

  app = module.createNestApplication();

  await app.init();

  patientRepo = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  patientService = await module.resolve<PatientsService>(PatientsService);
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

describe("Patients integration Tests", () => {
  it("Should wipe all patients data, but save as an ciopher key as LGPD compliance", async () => {
    const patient = patientMock() as Patient;

    const persistedPatient = await patientRepo.save(patient);
    expect(persistedPatient.deletedAt).toBeNull();
    expect(persistedPatient.lgpdKey).toBeNull();

    await patientService.lgpdDeletion(persistedPatient.id);

    const patientAfterLGPD = await patientRepo.findOne({
      where: {
        id: persistedPatient.id,
      },
      withDeleted: true,
    });

    expect(persistedPatient.id).toEqual(patient.id);
    expect(patientAfterLGPD).toMatchObject({
      id: patient.id,
      name: null,
      email: null,
      dob: null,
      phone: null,
      height: null,
      weight: null,
      genre: null,
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      deletedAt: expect.any(Date),
      lgpdKey: expect.any(String),
    } as Patient);
    expect(patientAfterLGPD.lgpdKey).not.toBeNull();
    expect(patientAfterLGPD.deletedAt).not.toBeNull();
  });
});
