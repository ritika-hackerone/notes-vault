import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await (isLogin ? login(email, password) : register(email, password));
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="card narrow">
      <h1>{isLogin ? "Log in" : "Create account"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>
          {busy ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>
      <p className="muted">
        {isLogin ? (
          <>No account? <Link to="/register">Sign up</Link></>
        ) : (
          <>Already registered? <Link to="/login">Log in</Link></>
        )}
      </p>
    </main>
  );
}