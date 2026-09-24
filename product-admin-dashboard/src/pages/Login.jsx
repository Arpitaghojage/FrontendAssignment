import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      login(data.accessToken);

      navigate("/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>

        <label>Username</label>

        <input
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        {error && (
          <p className="error-message">{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="credentials">
          <p>Demo username: emilys</p>
          <p>Demo password: emilyspass</p>
        </div>
      </form>
    </div>
  );
}

export default Login;