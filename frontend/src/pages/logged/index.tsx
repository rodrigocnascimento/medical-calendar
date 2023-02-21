import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AuthContext } from "../../context/user/auth.context";
import Patients from "../patients";
import Dashboard from "../dashboard";
import repository from "../../domain/repository";

export default function LoggedRoute() {
  const user: any = useContext(AuthContext);

  async function handleUserLogout() {
    await user.logout();
  }

  return (
    <Router>
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
          <Route path="/patients">
            <Patients inject={{ repository: repository() }} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
