import React from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import Dashboard from "../dashboard";
import repository from "../../domain/repository";
import { useAuth } from "../../context/auth/use-auth";
import LoginRoute from "../login";
import PatientsCreate from "../patients/patient.create";
import PatientsHome from "../patients/patient.home";
import AuthVerify from "../auth-verifier";
import { Button } from "@mui/material";
import "./index.css";

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
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/patients">Pacientes</Link>
            </li>
          </ul>
        </nav>
        <div id="logout">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleUserLogout()}
          >
            Logout
          </Button>
        </div>
      </div>
      <div id="detail">
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/login">
            <LoginRoute />
          </Route>
          <Route exact path={"/patients"}>
            <PatientsHome repository={repository().patient} />
          </Route>
          <Route
            path={["/patients/:id", "/patients/new"]}
            children={<PatientsCreate repository={repository().patient} />}
          />
        </Switch>
      </div>
    </>
  );
}
