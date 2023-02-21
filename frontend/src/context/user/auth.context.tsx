import React, { createContext, useEffect, useMemo, useState } from "react";
import { serverEndpoint } from "../../constants";
import { useHistory } from "react-router-dom";

type User = {
  isAuthenticated: boolean;
  login: any;
  logout: any;
  getToken: any;
} | null;

const AuthContext = createContext<User>(null);

function AuthProvider({
  children,
  inject: { http, storage: tokenStorage },
}: any) {
  const [isAuthenticated, setLogged] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const token = tokenStorage.get();

    if (token) setLogged(true);
  }, [tokenStorage, history]);

  // eslint-disable-next-line
  const login = async ({ email: username, password }: any) => {
    const response = await http.request({
      method: "POST",
      url: `${serverEndpoint}/auth/login`,
      body: { username, password },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { accessToken } = await response.json();

    tokenStorage.set(accessToken);

    setLogged(response.ok);
  };

  // eslint-disable-next-line
  const logout = async () => {
    tokenStorage.remove();

    setLogged(false);
  };

  // eslint-disable-next-line
  const getToken = async () => {
    return tokenStorage.get();
  };

  const user = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      getToken,
    }),
    [isAuthenticated, login, logout, getToken]
  );

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
