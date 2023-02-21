import React from "react";

import { AuthProvider } from "./user/auth.context";

import BaseInfrastructure from "../infrastructure";

const infra = BaseInfrastructure();

const dependencies = { http: infra.http, storage: infra.storage.token };

const AppProvider = ({ children }: any) => (
  <AuthProvider inject={dependencies}>{children}</AuthProvider>
);

export default AppProvider;
