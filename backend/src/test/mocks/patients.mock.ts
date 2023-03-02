import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { Genre } from "../../patients/patient.entity";

function defaultData(customData = {} as any, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      name = faker.name.fullName(),
      email = faker.internet.email(),
      dob = faker.date.birthdate({ min: 1900, max: 2000, mode: "year" }),
      phone = faker.phone.number().substring(0, 19),
      height = faker.datatype.float({ min: 130, max: 220, precision: 0.01 }),
      weight = faker.datatype.float({ min: 65, max: 170, precision: 0.01 }),
      genre = faker.helpers.arrayElement([Genre.M, Genre.F]),
      createdAt = new Date(),
      appointments = [],
    } = customData;

    return {
      id,
      name,
      email,
      dob,
      phone,
      height,
      weight,
      genre,
      appointments,
      createdAt,
    };
  });
}

export function build(options: MockDataOptions = {}) {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
