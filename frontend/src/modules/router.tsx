import React from "react";

import ApplicationRoutes from "./app";
import LoginRoute from "./auth/auth.login";
import { useAuth } from "context/use-auth";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { RepositoryProvider, UseCasesProvider } from "context";

const history = createBrowserHistory();

export default function RootRoute() {
  let auth = useAuth();

  return (
    <Router history={history}>
      {auth.user ? (
        <RepositoryProvider>
          <UseCasesProvider>
            <ApplicationRoutes />
          </UseCasesProvider>
        </RepositoryProvider>
      ) : (
        <LoginRoute />
      )}
    </Router>
  );
}
