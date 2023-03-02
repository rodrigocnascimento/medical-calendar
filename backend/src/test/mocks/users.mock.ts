import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { UserRoles } from "../../users/user.entity";

function defaultData(customData = {} as any, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      name = faker.name.fullName(),
      email = faker.internet.email(),
      role = faker.helpers.arrayElement([UserRoles.ADMIN, UserRoles.DOCTOR, UserRoles.PATIENT]),
      password = faker.internet.password(),
      createdAt = new Date(),
      updatedAt = new Date(),
      userAppointments = [],
    } = customData;

    return {
      id,
      name,
      email,
      role,
      password,
      createdAt,
      updatedAt,
      userAppointments,
    };
  });
}

export function build(options: MockDataOptions = {}) {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
