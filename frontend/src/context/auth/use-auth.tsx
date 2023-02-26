import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { serverEndpoint } from "env-constants";
import BaseInfrastructure, { IInfrastructures } from "infrastructure";
import { UserRoles } from "pages/users";

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
  const [user, setUser] = useState<JWTUser>();

  const postLoginRedirect = (role: string) =>
    ({
      [UserRoles.ADMIN]: "/users",
      [UserRoles.DOCTOR]: "/appointments",
      [UserRoles.PATIENT]: "/appointments",
    }[role]);

  const signin = async (username: string, password: string) => {
    const response = await http.request({
      method: "POST",
      url: `${serverEndpoint}/auth/login`,
      body: { username, password },
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao realizar o login!", {
        cause: jsonResponse.message,
      });
    }

    const { accessToken } = jsonResponse;

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
