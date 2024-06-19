import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import "./Home.css";

function Home({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data); // posts 안에 게시물들 넣어줌
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleUpdate = (postId, newTitle, newContent) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, title: newTitle, content: newContent }
          : post
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Board</h2>
      <div className="card-container">
        {posts.length === 0 ? (
          <div>No posts available.</div>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
