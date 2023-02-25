import React from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import Dashboard from "../dashboard";
import repository, { IRepositories } from "../../domain/repository";
import { useAuth } from "../../context/auth/use-auth";
import LoginRoute from "../login";
import PatientsForm from "../patients/patient.form";
import PatientsHome from "../patients/patient.home";
import UsersHome from "../users/user.home";
import UsersForm from "../users/user.form";
// import AuthVerify from "../auth-verifier";
import { Button } from "@mui/material";
import "./index.css";
import AppointmentsHome from "../appointments/appointments.home";

const { patient, appointments, user, medicalRegistries }: IRepositories = repository();

export default function ApplicationRoutes() {
  let history = useHistory();
  let auth = useAuth();

  function handleUserLogout() {
    auth.signout();
    history.push("/");
  }

  return (
    <>
      <div id="sidebar">
        <nav>
          Bem vindo, {auth.user.userName}
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/patients">Pacientes</Link>
            </li>
            {auth.user.userRole === "admin" && (
              <li>
                <Link to="/users">Administrar usuários</Link>
              </li>
            )}
            {auth.user.userRole === "doctor" && (
              <li>
                <Link to="/appointments">Minhas consultas</Link>
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
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/login">
            <LoginRoute />
          </Route>
          <Route exact path={"/patients"}>
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
