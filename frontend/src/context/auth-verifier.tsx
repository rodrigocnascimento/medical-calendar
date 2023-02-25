import { useLocation, withRouter } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "context/auth/use-auth";

function AuthVerify() {
  const auth = useAuth();
  const userToken = auth.getUserToken();

  const location = useLocation<any>();

  useEffect(() => {
    if (userToken?.expired) {
      auth.signout();
    }
  }, [location.pathname, userToken, auth]);

  return <></>;
}

export default withRouter(AuthVerify);
