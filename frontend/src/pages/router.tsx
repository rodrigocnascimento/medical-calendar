import React from "react";

import LoggedRoute from "../pages/logged";
import NotLoggedRoute from "../pages/notlogged";
import { useAuth } from "../context/auth/use-auth";

import { BrowserRouter } from "react-router-dom";
export default function RootRoute() {
  let auth = useAuth();

  return (
    <BrowserRouter>
      {auth.user ? <LoggedRoute /> : <NotLoggedRoute />}
    </BrowserRouter>
  );
}
