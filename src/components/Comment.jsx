import React, { useState } from "react";
import axios from "axios";

function Comment({ postId, fetchComments }) {
  const [content, setContent] = useState("");

  const handleComment = async () => {
    try {
      await axios.post(`/api/posts/${postId}/comments`, { content });
      fetchComments(); // 댓글 목록 갱신
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Comment"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleComment}>Submit</button>
    </div>
  );
}

export default Comment;
