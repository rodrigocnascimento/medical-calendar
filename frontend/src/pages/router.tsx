import React from "react";

import ApplicationRoutes from "./app";
import LoginRoute from "./login";
import { useAuth } from "../context/auth/use-auth";

import { BrowserRouter } from "react-router-dom";

export default function RootRoute() {
  let auth = useAuth();

  return (
    <BrowserRouter>
      {auth.user ? <ApplicationRoutes /> : <LoginRoute />}
    </BrowserRouter>
  );
}
