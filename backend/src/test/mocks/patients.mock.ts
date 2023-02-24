import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { Genre, Patient } from "../../patients/patient.entity";

function defaultData(customData = {}, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      name = faker.name.fullName(),
      email = faker.internet.email(),
      dob = faker.date.birthdate({ min: 1900, max: 2000, mode: "year" }),
      phone = faker.phone.number(),
      height = faker.datatype.float({ min: 130, max: 220, precision: 0.01 }),
      weight = faker.datatype.float({ min: 65, max: 170, precision: 0.01 }),
      genre = faker.helpers.arrayElement([Genre.M, Genre.F]),
      createdAt = new Date(),
    }: Partial<Patient> = customData;

    return {
      id,
      name,
      email,
      dob,
      phone,
      height,
      weight,
      genre,
      createdAt,
    } as Patient;
  });
}

export function build(options: MockDataOptions<Patient> = {}): Patient | Patient[] {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
