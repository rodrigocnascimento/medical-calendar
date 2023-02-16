import React, { useEffect, useState } from "react";
import logo from "./assets/logo-pebmed.png";
import "./App.css";

const serverEndpoint = process.env.SERVER_ENDPOINT || "http://localhost";

function App() {
  const [serverResponse, setServerResponse] = useState<string>();

  async function handleServerShake() {
    fetch(serverEndpoint)
      .then((response: any) => {
        setServerResponse(response);
      })
      .catch((error: Error) => {
        setServerResponse(error.message);
      });
  }

  useEffect(() => {
    handleServerShake();
  }, [serverResponse]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="PEBMED Logo" />
        <p>
          The server response: <code>{serverResponse}</code>
        </p>
      </header>
    </div>
  );
}

export default App;
