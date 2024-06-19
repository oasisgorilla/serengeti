import React from "react";
import "./Post.css";
import api from "../api";

function Post({ post, onDelete, currentUser }) {
  const handleDelete = async () => {
    try {
      if (post.authorId !== currentUser.id) {
        console.error("Permission denied: You are not the author of this post");
        return;
      }

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
        {currentUser && post.authorId === currentUser.id && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default Post;
