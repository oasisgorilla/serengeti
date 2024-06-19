import React, { useState } from "react";
import "./Post.css";
import api from "../api";

function Post({ post, onDelete, currentUser, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  console.log("Post:", post);
  console.log("CurrentUser:", currentUser);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${post.id}`, { title, content });
      if (onUpdate) {
        onUpdate(post.id, title, content);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(post.title);
    setContent(post.content);
  };

  return (
    <div>
      <div className="card">
        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <h2 className="card-title">{post.title}</h2>
            <p className="card-content">{post.content}</p>
            {currentUser && post.authorId === currentUser.id && (
              <>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Post;
