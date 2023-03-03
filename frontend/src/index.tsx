import React from "react";
import ReactDOM from "react-dom/client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import { ProvideAuth } from "context";

import RootRoute from "modules/router";

import reportWebVitals from "./reportWebVitals";

const theme = createTheme({
  palette: {
    background: {
      default: "#54B57A",
    },
    primary: {
      main: "#54B57A",
      dark: "#64be76",
      contrastText: "#fff",
    },
    secondary: {
      main: "#6091E0",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "outlined" && {
            ":hover": {
              backgroundColor: "#64be76",
              color: "#fff",
            },
          }),
        }),
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProvideAuth>
        <RootRoute />
      </ProvideAuth>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
