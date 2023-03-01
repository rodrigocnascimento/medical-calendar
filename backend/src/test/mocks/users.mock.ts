import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { MedicalAppointment } from "../../medical_appointments/medical_appointments.entity";
import { User, UserRoles } from "../../users/user.entity";

function defaultData(customData = {}, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      name = faker.name.fullName(),
      email = faker.internet.email(),
      role = faker.helpers.arrayElement([UserRoles.ADMIN, UserRoles.DOCTOR, UserRoles.PATIENT]),
      password = faker.internet.password(),
      createdAt = new Date(),
      updatedAt = new Date(),
      userAppointments = [] as MedicalAppointment[],
    }: Partial<User> = customData;

    return {
      id,
      name,
      email,
      role,
      password,
      createdAt,
      updatedAt,
      userAppointments,
    } as User;
  });
}

export function build<T>(options: MockDataOptions<T> = {}): T | T[] {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData) as T;
}
