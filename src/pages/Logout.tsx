import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "context/AuthContext";

export default function Logout(): JSX.Element {
  const history = useHistory();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    history.replace("/");
  }, [history, logout]);

  return <div className="container page">Signing out...</div>;
}
