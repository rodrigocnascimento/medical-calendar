import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export type TErrorMessage = {
  title: string;
  errors: any;
};

type TErrorListMap = {
  errorList: Map<string, any>;
};

const ErrorsList = ({ errorList }: TErrorListMap) => {
  let errorComponent: any = [];
  errorList.forEach((error: any, key: string) => {
    if (!Array.isArray(error)) {
      <ul>{errorComponent.push(<li key={key}>{error.message}</li>)}</ul>;
    } else {
      Array.isArray(error) &&
        errorComponent.push(
          <div key={key}>
            <strong>{key}</strong>
            <ul>
              {error.map((message: unknown, i: number) => (
                <li key={i++}>{message as string}</li>
              ))}
            </ul>
          </div>
        );
    }
  });

  return <React.Fragment>{errorComponent}</React.Fragment>;
};

export default function ErrorMessage({ title, errors }: TErrorMessage) {
  const mapErrors = new Map(Object.entries(errors));
  return (
    <Alert severity="error" style={{ marginBottom: 20 }}>
      <AlertTitle>
        <strong>{title ?? errors.name}</strong>
      </AlertTitle>
      <ErrorsList errorList={mapErrors} />
    </Alert>
  );
}
