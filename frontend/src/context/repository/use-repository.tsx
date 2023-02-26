import React, { createContext, ReactNode, useContext } from "react";
import repository, { IRepositories } from "domain/repository";

const RepositoryContext = createContext<IRepositories>(repository());

export function RepositoryProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const {
    patient,
    appointments,
    user,
    medicalRegistries,
    auth,
  }: IRepositories = repository();

  return (
    <RepositoryContext.Provider
      value={{ patient, appointments, user, medicalRegistries, auth }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

export const useRepository = () => {
  return useContext(RepositoryContext);
};
