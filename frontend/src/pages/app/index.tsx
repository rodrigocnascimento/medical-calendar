import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useHistory, useLocation } from "react-router-dom";
import { useAuth, useRepository } from "../../context";
import LoginRoute from "../login";
import PatientsForm from "../patients/patient.form";
import PatientsHome from "../patients/patient.home";
import UsersHome from "../users/user.home";
import UsersForm from "../users/user.form";
import AuthVerify from "../auth-verifier";
import { Button } from "@mui/material";
import AppointmentsHome from "../appointments/appointments.home";
import "./index.css";
import "../../root.css";

export default function ApplicationRoutes() {
  const { patient, appointments, user, medicalRegistries } = useRepository();
  let history = useHistory();
  let auth = useAuth();

  const location = useLocation<any>();

  const [activePath, setActivePath] = useState<string>("/");

  function handleUserLogout() {
    auth.signout();
    history.push("/");
  }

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
                className={["/patients", "/"].includes(activePath) ? "active" : ""}
                to="/patients"
              >
                Pacientes
              </Link>
            </li>
            {auth.user.userRole === "admin" && (
              <li>
                <Link className={activePath === "/users" ? "active" : ""} to="/users">
                  Administrar usuários
                </Link>
              </li>
            )}
            {auth.user.userRole === "doctor" && (
              <li>
                <Link className={activePath === "/appointments" ? "active" : ""} to="/appointments">
                  Minhas consultas
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div id="logout">
          <Button variant="outlined" color="primary" onClick={() => handleUserLogout()}>
            Logout
          </Button>
        </div>
      </div>
      <div id="detail" style={{ overflow: "scroll" }}>
        <Switch>
          <Route path="/login">
            <LoginRoute />
          </Route>
          <Route exact path={["/patients", "/"]}>
            <PatientsHome repository={{ patient, appointments, user }} />
          </Route>
          <Route
            path={["/patients/:id", "/patients/new"]}
            children={<PatientsForm repository={patient} />}
          />
          <Route exact path={"/users"}>
            <UsersHome repository={{ user }} />
          </Route>
          <Route
            path={["/users/:id", "/users/new"]}
            children={<UsersForm repository={{ user }} />}
          />
          <Route exact path={"/appointments"}>
            <AppointmentsHome repository={{ appointments, medicalRegistries }} />
          </Route>
        </Switch>
      </div>
    </>
  );
}
