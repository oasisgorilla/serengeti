import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/signup", { username, password });
      console.log("User signed up successfully:", response.data);
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      setError("Error signing up");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
      <Link to="/login">Login</Link> {/* 로그인 페이지로 이동하는 링크 */}
    </div>
  );
}

export default Signup;
