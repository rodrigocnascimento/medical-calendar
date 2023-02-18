import { MockDataOptions, createMockData } from './autoMock';
import { faker } from '@faker-js/faker';
import { MedicalAppointment } from '../../medical_appointments/medical_appointments.entity';

function defaultData(customData = {}, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      date = faker.date.future(),
      createdAt = new Date(),
      updatedAt = new Date(),
    }: Partial<MedicalAppointment> = customData;

    return {
      id,
      date,
      createdAt,
      updatedAt,
    } as MedicalAppointment;
  });
}

export function build(
  options: MockDataOptions<MedicalAppointment> = {},
): MedicalAppointment | MedicalAppointment[] {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
