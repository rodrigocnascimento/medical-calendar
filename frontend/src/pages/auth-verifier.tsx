import { withRouter } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../context/auth/use-auth";

function AuthVerify({ history }: any) {
  const auth = useAuth();
  const expired = auth.getUserToken().expired;

  useEffect(() => {
    const unlisten = history.listen((location: any, action: any) => {
      if (expired) {
        history.push("/login");
      }
    });

    return unlisten;
  }, [history, expired]);

  return <></>;
}

export default withRouter(AuthVerify);
