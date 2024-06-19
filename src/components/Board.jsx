import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "./Post";

function Board() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  if (posts.length === 0) {
    return <div>No posts available.</div>; // 게시글이 없는 경우 표시
  }

  return (
    <div>
      <h1>Board</h1>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Board;
