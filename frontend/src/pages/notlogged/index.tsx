import React, { useContext, useState } from "react";
import logo from "../../assets/logo-pebmed.png";
import "./notlogged.css";
import "../../index.css";

import { AuthContext } from "../../context/user/auth.context";

export default function NotLoggedRoute() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const user: any = useContext(AuthContext);

  async function handleUserLogin(e: any) {
    e.preventDefault();

    await user.login({ email, password });
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
        </div>
      </form>
    </div>
  );
}
