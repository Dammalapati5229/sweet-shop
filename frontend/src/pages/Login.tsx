import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await login({ email, password });

    localStorage.setItem("token", res.data.token);

    const role = getUserRole();

    if (role === "admin") {
      navigate("/admin");   // ADMIN REDIRECT
    } else {
      navigate("/");        // Normal user
    }
  } catch {
    alert("Invalid email or password");
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sweet Shop Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="login-footer">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
