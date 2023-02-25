import {  useLocation, withRouter } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../context/auth/use-auth";

function AuthVerify() {
  const auth = useAuth();
  const expired = auth.getUserToken().expired;

  const location = useLocation<any>();

  useEffect(() => {
    if (expired) {
      auth.signout();
    }
  }, [location.pathname, expired, auth]);

  return <></>;
}

export default withRouter(AuthVerify);
