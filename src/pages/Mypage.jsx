// ChangePasswordForm.jsx

import React, { useState } from "react";
import api from "../api";

const ChangePasswordForm = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/change-password", {
        username,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      // 오류가 발생하면 여러 가지 상황에 따라 적절한 메시지를 설정합니다.
      if (error.response) {
        // 서버가 응답을 주었지만, 상태 코드가 2xx가 아닌 경우
        setMessage(error.response.data.error);
      } else if (error.request) {
        // 서버가 응답을 주지 않은 경우
        setMessage("No response received from server");
      } else {
        // 요청을 보내기 전에 발생한 오류
        setMessage("Error during request setup: " + error.message);
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePasswordForm;
