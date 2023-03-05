import { Redirect, useLocation, withRouter } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "context";

function AuthVerify() {
  const auth = useAuth();
  const userToken = auth.getUserToken();
  const location = useLocation<any>();

  const userPermission = auth.userPermission(auth.user.userRole);
  const permission = userPermission(location.pathname);

  useEffect(() => {
    if (userToken?.expired) {
      auth.signout();
    }
  }, [location.pathname, userToken, auth]);

  if (!permission.allow) {
    return <Redirect to={permission.redirectTo} />;
  }

  return <></>;
}

export const AuthVerifier = withRouter(AuthVerify);
