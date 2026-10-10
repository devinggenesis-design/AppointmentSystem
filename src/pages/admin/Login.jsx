import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Scissors, User, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";

const ADMIN = { username: "admin", password: "admin123" };

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (localStorage.getItem("adminToken")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    if (username.trim() === ADMIN.username && password === ADMIN.password) {
      localStorage.setItem("adminToken", "logged-in");
      navigate("/admin/dashboard");
    } else {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <Scissors size={26} />
        </div>

        <h1 className="login-title">Barbershop</h1>
        <p className="login-subtitle">Sign in to manage appointments</p>

        {error && <div className="login-error">{error}</div>}

        <label className="login-field">
          <span>Username</span>
          <div className="login-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              autoComplete="username"
              autoFocus
            />
          </div>
        </label>

        <label className="login-field">
          <span>Password</span>
          <div className="login-input">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button type="submit" className="login-submit">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
