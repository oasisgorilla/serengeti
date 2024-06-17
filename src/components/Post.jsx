import React from "react";
import api from "../api";

function Post({ post, onDelete }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Post;
