import { Link, NavLink } from "react-router-dom";

export default function Header(): JSX.Element {
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
          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" to="/login">
              Sign in
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
