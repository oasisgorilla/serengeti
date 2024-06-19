// Mypage.jsx
import React from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";

const Mypage = ({ user }) => {
  return (
    <div>
      <h2>My Page</h2>
      <p>Username: {user.username}</p>
      <ChangePasswordForm username={user.username} />
    </div>
  );
};

export default Mypage;
