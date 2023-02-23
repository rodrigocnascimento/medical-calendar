import React, { useState } from "react";
import logo from "../../assets/logo.png";

import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/use-auth";
import { TextField, Button } from "@mui/material";

import "./login.css";
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
        setTimeout(() => {
          history.go(0);
        }, 100);
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
          <img src={logo} className="App-logo" alt="Logo" />

          <div className="form-group">
            <label className="form-group-label">Email</label>
            <TextField
              id="username"
              fullWidth={true}
              placeholder="Username"
              type="text"
              name="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-group-label">Senha</label>
            <TextField
              fullWidth={true}
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ float: "right" }}
            >
              Entrar
            </Button>
          </div>
          {response && (
            <p style={{ clear: "both", color: "red" }}>{response}</p>
          )}
        </div>
      </form>
    </div>
  );
}
