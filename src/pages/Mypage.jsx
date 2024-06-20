import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import "./Mypage.css";
import ChangePasswordForm from "../components/ChangePasswordForm";

const Mypage = ({ user }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await api.get(`/users/${user.id}/liked-posts`);
        setLikedPosts(response.data);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    fetchLikedPosts();
  }, [user.id]);

  return (
    <div>
      <h2>My Page</h2>
      <p>Username: {user.username}</p>
      <ChangePasswordForm username={user.username} />

      <h2>My Liked Posts</h2>
      {likedPosts.length === 0 ? (
        <p>No liked posts yet</p>
      ) : (
        likedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onClick={() => openPostDetail(post)}
          />
        ))
      )}
    </div>
  );
};

export default Mypage;
