import React from "react";

import ApplicationRoutes from "./app";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthProvider, UseCasesProvider } from "context";

const history = createBrowserHistory();

export default function RootRoute() {
  return (
    <Router history={history}>
      <UseCasesProvider>
        <AuthProvider>
          <ApplicationRoutes />
        </AuthProvider>
      </UseCasesProvider>
    </Router>
  );
}
