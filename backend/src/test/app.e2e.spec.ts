import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { AppController } from "../app.controller";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { build as userMock } from "./mocks/users.mock";
import { UserRoles } from "../users/user.entity";
import { UsersService } from "../users/users.service";

jest.setTimeout(30000);

describe("AppModule", () => {
  let app: INestApplication;
  const appController = { public: () => "Hello World", _private: () => "PONG" };
  let authService: AuthService;
  let userService: UsersService;
  const user = userMock();
  let accessToken = "";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppController)
      .useValue(appController)
      .compile();

    app = moduleRef.createNestApplication();

    userService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);

    await app.init();

    const createdUser = await userService.create(user);

    const sigin = await authService.login({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      createdAt: new Date(),
      role: UserRoles.ADMIN,
    });

    accessToken = sigin.accessToken;
  });

  it(`/GET initial public route`, () => {
    return request(app.getHttpServer()).get("/").expect(200).expect(appController.public());
  });

  it(`/GET initial protected route`, () => {
    return request(app.getHttpServer())
      .get("/private-route")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .expect(appController._private());
  });

  afterAll(async () => {
    await app.close();
  });
});
