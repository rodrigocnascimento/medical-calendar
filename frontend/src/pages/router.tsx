import React from "react";

import ApplicationRoutes from "./app";
import LoginRoute from "./login";
import { useAuth } from "../context/auth/use-auth";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function RootRoute() {
  let auth = useAuth();

  return (
    <Router history={history}>
      
      {auth.user ? <ApplicationRoutes /> : <LoginRoute />}
    </Router>
  );
}
