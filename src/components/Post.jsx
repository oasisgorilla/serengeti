import React from "react";
import "./Post.css";
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
      <div className="card">
        <h2 className="card-title">{post.title}</h2>
        <p className="card-content">{post.content}</p>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default Post;
