import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export type TErrorMessage = {
  title: string;
  errors: any;
};

export default function ErrorMessage({ title, errors }: TErrorMessage) {
  console.log(errors, errors[0], Array.isArray(errors), Array.isArray(errors[0]));
  return (
    <Alert severity="error">
      <AlertTitle>
        <strong>{title}</strong>
      </AlertTitle>
      {Object.keys(errors).map((error: any) => {
        return (
          <div key={error}>
            <strong>{error}</strong>:{" "}
            <ul>
              {errors[error].map((err: string, i: any) => (
                <li key={i++}>{err}</li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* {!Array.isArray(errors) && <div key={0}>{errors}</div>} */}
    </Alert>
  );
}
