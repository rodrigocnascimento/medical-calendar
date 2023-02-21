import React, { useState } from "react";
import logo from "../../assets/logo-pebmed.png";
import "./login.css";
import "../../index.css";

import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/use-auth";

export default function NotLoggedRoute() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from }: any = location.pathname || { from: { pathname: "/" } };

  async function handleUserLogin(e: any) {
    e.preventDefault();

    auth
      .signin(email, password)
      .then(() => {
        history.replace(from);
      })
      .catch((error: any) => {
        setResponse(error.message);
      });
  }

  return (
    <div className="form-container">
      <form className="form" method="post" onSubmit={handleUserLogin}>
        <div className="form-content">
          <h3 className="form-title">Sign In</h3>
          <img src={logo} className="App-logo" alt="PEBMED Logo" />

          <div className="form-group">
            <label>Email</label>
            <input
              id="username"
              aria-label="User name"
              placeholder="Username"
              type="text"
              name="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              id="password"
              aria-label="User password"
              placeholder="Password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-right">
            <button type="submit">Entrar</button>
          </div>
          {response && (
            <p style={{ clear: "both", color: "red" }}>{response}</p>
          )}
        </div>
      </form>
    </div>
  );
}
