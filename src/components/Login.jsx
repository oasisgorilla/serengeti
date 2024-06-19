import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
      <div className="login-form-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p>{error}</p>}
        </form>
        <Link to="/signup">Sign Up</Link> {/* 회원가입 링크 */}
      </div>
  );
}

export default Login;
