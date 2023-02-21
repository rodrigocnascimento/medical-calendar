import React from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import Patients from "../patients";
import Dashboard from "../dashboard";
import repository from "../../domain/repository";
import { useAuth } from "../../context/auth/use-auth";
import NotLoggedRoute from "../notlogged";

function PrivateRoute({ children, ...rest }: any) {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default function LoggedRoute() {
  let history = useHistory();
  let auth = useAuth();

  function handleUserLogout() {
    auth.signout(() => history.push("/"));
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
          <button onClick={() => handleUserLogout()}>Logout</button>
        </div>
      </div>
      <div id="detail">
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/login">
            <NotLoggedRoute />
          </Route>
          <PrivateRoute path="/patients">
            <Patients inject={{ repository: repository() }} />
          </PrivateRoute>
        </Switch>
      </div>
    </>
  );
}
