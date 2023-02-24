import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export type TErrorMessage = {
  title: string;
  errors: any;
};

export default function ErrorMessage({ title, errors }: TErrorMessage) {
  return (
    // <Stack sx={{ width: '100%' }} spacing={s2}>
    <Alert severity="error">
      <AlertTitle>
        <strong>{title}</strong>
      </AlertTitle>
      {Object.keys(errors).map((error: string) => {
        return (
          <div key={error}>
            <strong>{error}</strong>:{" "}
            <ul>
              {errors[error].map((err: string, i: number) => (
                <li key={i++}>{err}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </Alert>
    // </Stack>
  );
}
