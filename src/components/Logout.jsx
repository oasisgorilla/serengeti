import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../api"; // api 객체를 가져옴

function Logout({ setUser }) {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await api.post("/logout"); // 서버에 로그아웃 요청을 보냄
        localStorage.removeItem("user");
        setUser(null);
        console.log("log out");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    performLogout();
  }, [setUser]);

  return <Navigate to="/login" />;
}

export default Logout;
