import React, { useState } from "react";
import axios from "axios";

function WritePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/api/posts", { title, content });
      // 글 목록 페이지로 이동 등 추가 작업
    } catch (error) {
      console.error("Failed to write post", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default WritePost;
