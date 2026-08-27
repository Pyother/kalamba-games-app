import { useState } from "react";
import type { FormEvent } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { useAuth } from "context/AuthContext";

export default function Login(): JSX.Element {
  const history = useHistory();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      history.replace("/");
    } catch {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="auth-page container page">Loading session...</div>;
  }

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>

            {error && (
              <ul className="error-messages" role="alert">
                <li>{error}</li>
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    autoComplete="email"
                    className="form-control form-control-lg"
                    onChange={event => setEmail(event.target.value)}
                    placeholder="Email"
                    required
                    type="email"
                    value={email}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    autoComplete="current-password"
                    className="form-control form-control-lg"
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    type="password"
                    value={password}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
