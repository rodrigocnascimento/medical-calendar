import React, { createContext, ReactNode, useContext } from "react";

import {
  create,
  load,
  edit,
  loadAll,
  remove,
} from "modules/users/user.use-cases";

import type { TUserUseCase } from "modules/users/user.use-cases";

interface IUseCase {
  userUseCases: TUserUseCase;
}

const UseCasesContext = createContext<IUseCase | null>(null);

export function UseCasesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const userUseCases = { create, load, edit, loadAll, remove };

  return (
    <UseCasesContext.Provider value={{ userUseCases }}>
      {children}
    </UseCasesContext.Provider>
  );
}

export const useCases = () => {
  return useContext(UseCasesContext) as IUseCase;
};
