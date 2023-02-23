import React, { useState, useEffect, useContext, createContext } from "react";
import { serverEndpoint } from "../../constants";
import BaseInfrastructure from "../../infrastructure";

type Auth = any | null;

const AuthContext = createContext<Auth>(false);

export function ProvideAuth({ children }: any) {
  const { http, storage } = BaseInfrastructure();

  const auth = useProvideAuth({ http, storage });

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth({ http, storage }: any) {
  const [user, setUser] = useState(null);

  const signin = async (username: string, password: string) => {
    const response = await http.request({
      method: "POST",
      url: `${serverEndpoint}/auth/login`,
      body: { username, password },
    });

    if (!response.ok) {
      const realResponse = await response.json();
      console.error(realResponse);
      throw new Error(realResponse.message);
    }

    const { accessToken } = await response.json();

    storage.token.set(accessToken);

    setUser(storage.token.get());
  };

  const signup = async (username: string, password: string) => {
    throw new Error("not implemented yet");
  };

  const signout = () => {
    storage.token.remove();

    setUser(null);
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
