import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옴
import api from "../api";

function WritePost({user}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅을 초기화

  const handleSubmit = async (e) => {
    if (!user) {
      alert("로그인 후 작성할 수 있습니다.");
      navigate("/login");
      return;
    }
    e.preventDefault();
    try {
      const response = await api.post("/posts", { title, content });
      setPosts([...posts, response.data]);
      setTitle("");
      setContent("");
      alert("게시 성공!"); // 성공 알림 메시지 표시
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1>Write Post</h1>
      <p>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p>
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </p>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default WritePost;
