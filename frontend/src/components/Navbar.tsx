import { getUserName, isLoggedIn, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const name = getUserName();

  return (
    <div className="navbar">
      <div className="navbar-left">Sweet Shop</div>

      <div className="navbar-right">
        {!loggedIn ? (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <>
            <span className="welcome-text">Welcome, {name}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
