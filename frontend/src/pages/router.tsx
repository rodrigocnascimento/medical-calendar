import { useContext } from "react";
import { AuthContext } from "../context/user/auth.context";
import LoggedRoute from "../pages/logged";
import NotLoggedRoute from "../pages/notlogged";

export default function RootRoute() {
  const user: any = useContext(AuthContext);

  return user.isAuthenticated ? <LoggedRoute /> : <NotLoggedRoute />;
}
