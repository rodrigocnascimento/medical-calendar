import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { Genre, Patient } from "../../patients/patient.entity";
import { MedicalAppointment } from "src/medical_appointments/medical_appointments.entity";

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
      appointments = [] as MedicalAppointment[],
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
      appointments,
      createdAt,
    } as Patient;
  });
}

export function build<T>(options: MockDataOptions<T> = {}): T | T[] {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData) as T;
}
