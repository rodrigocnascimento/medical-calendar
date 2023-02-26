import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "context";
import LoginRoute from "pages/login";
import { ListPatients, CreatePatient, UpdatePatient } from "pages/patients";
import { ListUsers, CreateUser, UpdateUser } from "pages/users";
import AuthVerify from "context/auth-verifier";
import { Button } from "@mui/material";
import { AppointmentsHome } from "pages/appointments";
import "./index.css";
import "root.css";

export default function ApplicationRoutes() {
  let auth = useAuth();

  const location = useLocation<any>();

  const [activePath, setActivePath] = useState<string>("/");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <AuthVerify />
      <div id="sidebar">
        <nav>
          Bem vindo, {auth.user.userName}
          <ul>
            <li>
              <Link
                className={
                  ["/patients", "/"].includes(activePath) ? "active" : ""
                }
                to="/patients"
              >
                Pacientes
              </Link>
            </li>
            {auth.user.userRole === "admin" && (
              <li>
                <Link
                  className={activePath === "/users" ? "active" : ""}
                  to="/users"
                >
                  Administrar usuários
                </Link>
              </li>
            )}
            {auth.user.userRole === "doctor" && (
              <li>
                <Link
                  className={activePath === "/appointments" ? "active" : ""}
                  to="/appointments"
                >
                  Minhas consultas
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div id="logout">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => auth.signout()}
          >
            Logout
          </Button>
        </div>
      </div>
      <div id="detail" style={{ overflow: "scroll" }}>
        <Switch>
          <Route path="/login">
            <LoginRoute />
          </Route>

          <Route exact path={["/patients", "/"]} children={<ListPatients />} />
          <Route path={"/patients/new"}>
            <CreatePatient />
          </Route>
          <Route path={"/patients/:id"}>
            <UpdatePatient />
          </Route>

          <Route exact path={"/users"} children={<ListUsers />} />
          <Route path={"/users/new"}>
            <CreateUser />
          </Route>
          <Route path={"/users/:id"}>
            <UpdateUser />
          </Route>

          <Route exact path={"/appointments"}>
            <AppointmentsHome />
          </Route>
        </Switch>
      </div>
    </>
  );
}
