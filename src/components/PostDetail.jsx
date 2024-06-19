import React, { useState, useEffect } from "react";
import api from "../api";
import "./PostDetail.css";

function PostDetail({ post, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/posts/${post.id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const checkLiked = async () => {
      try {
        const response = await api.get(`/users/${currentUser.id}/liked-posts`);
        setLiked(response.data.some((likedPost) => likedPost.id === post.id));
      } catch (error) {
        console.error("Error checking liked status:", error);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const response = await api.get(`/posts/${post.id}/likes`);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchComments();
    fetchLikeCount();
    checkLiked();
  }, [post.id, currentUser.id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/unlike`);
        setLikeCount(likeCount - 1);
      } else {
        await api.post(`/posts/${post.id}/like`);
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/${post.id}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <h3>{likeCount}</h3>
        <button onClick={handleLike}>{liked ? "Unlike" : "Like"}</button>
        <h3>Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.author}:</strong> {comment.content}
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
}

export default PostDetail;
