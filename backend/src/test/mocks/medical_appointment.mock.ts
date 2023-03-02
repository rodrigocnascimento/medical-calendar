import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";

function defaultData(customData = {} as any, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      date = faker.date.future(),
      patient = {},
      medicalRegistries = [],
      doctor = {},
      createdAt = new Date(),
      updatedAt = new Date(),
    } = customData;

    return {
      id,
      date,
      patient,
      medicalRegistries,
      doctor,
      createdAt,
      updatedAt,
    };
  });
}

export function build(options: MockDataOptions = {}) {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
