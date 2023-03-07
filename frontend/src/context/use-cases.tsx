import React, { createContext, ReactNode, useContext } from "react";

import * as UserUseCases from "modules/users/user.use-cases";
import * as PatientUseCases from "modules/patients/patients.use-cases";
import * as AppointmentUseCases from "modules/appointments/appointments.use-cases";
import * as MedicalRegistriesUseCases from "modules/medical_registries/medical_registries.use-cases";
import * as AuthUseCases from "modules/auth/auth.use-cases";

import type { TUserUseCase } from "modules/users/user.use-cases";
import type { TPatientUseCase } from "modules/patients/patients.use-cases";
import type { TAppointmentUseCases } from "modules/appointments/appointments.use-cases";
import type { TMedicalRegistriesUseCases } from "modules/medical_registries/medical_registries.use-cases";
import type { TAuthUseCases } from "modules/auth/auth.use-cases";

interface IUseCase {
  UserUseCases: TUserUseCase;
  PatientUseCases: TPatientUseCase;
  AppointmentUseCases: TAppointmentUseCases;
  MedicalRegistriesUseCases: TMedicalRegistriesUseCases;
  AuthUseCases: TAuthUseCases;
}

const UseCasesContext = createContext<IUseCase | null>(null);

export function UseCasesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <UseCasesContext.Provider
      value={{
        UserUseCases,
        PatientUseCases,
        AppointmentUseCases,
        MedicalRegistriesUseCases,
        AuthUseCases,
      }}
    >
      {children}
    </UseCasesContext.Provider>
  );
}

export const useCases = () => {
  return useContext(UseCasesContext) as IUseCase;
};
