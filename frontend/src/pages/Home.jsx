import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="auth-card">
      <h2>Auth Flow Demo</h2>
      {user ? (
        <p>
          Logged in as <strong>{user.name}</strong>. Go to your{" "}
          <Link to="/dashboard">dashboard</Link>.
        </p>
      ) : (
        <p>
          <Link to="/signup">Sign up</Link> or <Link to="/login">log in</Link> to access the
          protected page.
        </p>
      )}
    </div>
  );
}
