import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, just check if fields are filled in
    if (username && password) {
      navigate("/"); // Redirect to Home Page
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button className="login-submit reg_button" type="button" onClick={handleLogin}>
          Login
        </button>
        <button className="secondary-option" onClick={() => navigate('/register')}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Login;
