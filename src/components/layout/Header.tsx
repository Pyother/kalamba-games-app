import { Link, NavLink } from "react-router-dom";

import { useAuth } from "context/AuthContext";

export default function Header(): JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" exact to="/">
              Home
            </NavLink>
          </li>
          {!isLoading && !isAuthenticated && (
            <li className="nav-item">
              <NavLink activeClassName="active" className="nav-link" to="/login">
                Sign in
              </NavLink>
            </li>
          )}
          {!isLoading && user && (
            <>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  to={`/profile/${encodeURIComponent(user.username)}`}
                >
                  {user.username}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/logout">
                  Log out
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
