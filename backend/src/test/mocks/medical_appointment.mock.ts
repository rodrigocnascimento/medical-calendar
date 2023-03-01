import { MockDataOptions, createMockData } from "./autoMock";
import { faker } from "@faker-js/faker";
import { MedicalAppointment } from "../../medical_appointments/medical_appointments.entity";
import { MedicalRegistry } from "src/medical_registries/medical_registry.entity";
import { Patient } from "src/patients/patient.entity";
import { User } from "src/users/user.entity";

function defaultData(customData = {}, quantityToGenerate = 1) {
  return [...Array(quantityToGenerate).keys()].map(() => {
    const {
      id = faker.datatype.uuid(),
      date = faker.date.future(),
      patient = {} as Patient,
      medicalRegistries = [] as MedicalRegistry[],
      doctor = {} as User,
      createdAt = new Date(),
      updatedAt = new Date(),
    }: Partial<MedicalAppointment> = customData;

    return {
      id,
      date,
      patient,
      medicalRegistries,
      doctor,
      createdAt,
      updatedAt,
    } as MedicalAppointment;
  });
}

export function build(
  options: MockDataOptions<MedicalAppointment> = {}
): MedicalAppointment | MedicalAppointment[] {
  const { customData, quantityToGenerate } = options;

  const entityObject = defaultData(customData, quantityToGenerate);

  return createMockData(entityObject, customData);
}
