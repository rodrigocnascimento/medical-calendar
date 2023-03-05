import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useMemo,
} from "react";

import BaseInfrastructure from "infrastructure";
import { UserRoles } from "modules/users";

import { JWTUserToken } from "modules/auth";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import { useCases } from "./use-cases";

type Auth = any | null;

const AuthContext = createContext<Auth>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const {
    storage: { token },
  } = BaseInfrastructure();

  const auth = useProvideAuth(token);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth(token: ITokenStorage) {
  const [user, setUser] = useState<JWTUserToken>();
  const { AuthUseCases } = useCases();

  const postLoginRedirect = useMemo(
    () => (role: string) =>
      ({
        [UserRoles.ADMIN]: "/users",
        [UserRoles.DOCTOR]: "/appointments",
        [UserRoles.PATIENT]: "/appointments",
      }[role]),
    []
  );

  const userPermission = (role: string) =>
    ({
      [UserRoles.ADMIN]: (permission: string) => ({
        allowed: !!permission,
        redirectTo: "/",
      }),
      [UserRoles.DOCTOR]: (permission: string) => ({
        allowed: ["/patients", "/appointments"].includes(permission),
        redirectTo: "/patients",
      }),
      [UserRoles.PATIENT]: (permission: string) => ({
        allowed: ["/appointments"].includes(permission),
        redirectTo: "/appointments",
      }),
    }[role]);

  const signin = async (
    username: string,
    password: string
  ): Promise<string> => {
    AuthUseCases.login(
      {
        username,
        password,
      },
      {
        onSuccess: ({ accessToken }) => {
          token.set(accessToken);

          setUser(token.get());
        },
      }
    );

    return postLoginRedirect(user?.userRole || "") as string;
  };

  const signup = async (username: string, password: string) => {
    throw new Error("not implemented yet");
  };

  const signout = () => {
    setUser(undefined);

    token.remove();
  };

  const getUserToken = () => {
    return token.get();
  };

  useEffect(() => {
    setUser(token.get());
  }, [token]);

  return {
    user,
    signin,
    signup,
    signout,
    getUserToken,
    userPermission,
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};
