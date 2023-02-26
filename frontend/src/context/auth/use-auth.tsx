import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

import BaseInfrastructure, { IInfrastructures } from "infrastructure";
import { UserRoles } from "modules/users";
import { useRepository } from "context/repository/use-repository";
import { JWTToken } from "modules/auth";

type Auth = any | null;

export type JWTUser = {
  exp: EpochTimeStamp;
  iat: EpochTimeStamp;
  expired: boolean;
  sub: string;
  userEmail: string;
  userName: string;
  userRole: string;
};

const AuthContext = createContext<Auth>(false);

export function ProvideAuth({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { http, storage } = BaseInfrastructure();

  const auth = useProvideAuth({ http, storage });

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth({ http, storage }: IInfrastructures) {
  const [user, setUser] = useState<JWTToken>();
  const { auth: authRepository } = useRepository();

  const postLoginRedirect = (role: string) =>
    ({
      [UserRoles.ADMIN]: "/users",
      [UserRoles.DOCTOR]: "/appointments",
      [UserRoles.PATIENT]: "/appointments",
    }[role]);

  const signin = async (username: string, password: string) => {
    const { accessToken } = await authRepository.checkCredentials({
      username,
      password,
    });

    storage.token.set(accessToken);

    const loggedUser = storage.token.get();

    setUser(loggedUser);

    return postLoginRedirect(loggedUser?.userRole || "");
  };

  const signup = async (username: string, password: string) => {
    throw new Error("not implemented yet");
  };

  const signout = () => {
    setUser(undefined);

    storage.token.remove();
  };

  const getUserToken = () => {
    return storage.token.get();
  };

  useEffect(() => {
    setUser(storage.token.get());
  }, [storage.token]);

  return {
    user,
    signin,
    signup,
    signout,
    getUserToken,
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};
