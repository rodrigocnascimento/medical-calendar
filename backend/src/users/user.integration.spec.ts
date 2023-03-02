import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";

import { INestApplication } from "@nestjs/common";

import { build as userMock } from "../test/mocks/users.mock";

import { closeE2ETests, setupE2EDB, testDatabaseConfigs } from "../database/test-datasource.config";
import { Repository } from "typeorm";

import { Patient } from "../patients/patient.entity";

import { UsersModule } from "./users.module";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { UUIDVersion } from "class-validator";

jest.setTimeout(30000);

let app: INestApplication;
let userService: UsersService;
let userRepo: Repository<User>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [UsersModule, TypeOrmModule.forRoot(testDatabaseConfigs)],
  }).compile();

  app = module.createNestApplication();

  await app.init();

  userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  userService = await module.resolve<UsersService>(UsersService);
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

describe("Users integration Tests", () => {
  it("Should soft delete the user", async () => {
    const user = userMock() as Patient;

    const persistedUser = await userRepo.save(user);
    expect(persistedUser.deletedAt).toBeNull();

    await userService.remove(persistedUser.id as UUIDVersion);

    const userAfterSoftRemove = await userRepo.findOne({
      where: {
        id: persistedUser.id,
      },
    });

    expect(persistedUser.id).toEqual(user.id);
    expect(userAfterSoftRemove).toBeNull();

    const userEvenRemoved = await userRepo.findOne({
      where: {
        id: persistedUser.id,
      },
      withDeleted: true,
    });
    expect(userEvenRemoved).not.toBeNull();
    expect(userEvenRemoved.deletedAt).toBeInstanceOf(Date);
  });
});
