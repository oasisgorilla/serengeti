import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옴
import api from "../api";
import "./WritePost.css";

function WritePost({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [posts, setPosts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅을 초기화

  const handleSubmit = async (e) => {
    if (!user) {
      alert("로그인 후 작성할 수 있습니다.");
      navigate("/login");
      return;
    }
    e.preventDefault();
    try {
      const response = await api.post("/posts", {
        title,
        content,
        authorId: user.id,
      });
      // setPosts([...posts, response.data]);
      setTitle("");
      setContent("");
      alert("게시 성공!"); // 성공 알림 메시지 표시
      setShowAlert(true); // 게시 성공 시 alert를 보이도록 설정
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h2>Write Post</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
      {showAlert && <div className="alert">게시 성공!</div>}
    </div>
  );
}

export default WritePost;
