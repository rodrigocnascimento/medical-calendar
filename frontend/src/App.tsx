import React, { useEffect, useState } from "react";
import logo from "./assets/logo-pebmed.png";
import "./App.css";

const serverEndpoint =
  process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost";

function App() {
  const [serverResponse, setServerResponse] = useState<string>();

  async function handleServerShake() {
    const response = await fetch(serverEndpoint);

    setServerResponse(await response.text());

    if (!response.ok) {
      setServerResponse(response.statusText);
    }
  }

  useEffect(() => {
    handleServerShake();
  }, []);

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
