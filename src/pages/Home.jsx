import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import PostDetail from "../components/PostDetail";
import "./Home.css";

function Home({ currentUser }) {
  // App.jsx에서 currentUser 받아옴
  const [posts, setPosts] = useState([]); // post state
  const [loading, setLoading] = useState(true); // loading state
  const [selectedPost, setSelectedPost] = useState(null); // selectedPost state

  useEffect(() => {
    // 페이지 로드되자마자 시작될 동작
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts"); // get으로 api 에서 post정보 받아옴
        setPosts(response.data); // posts 안에 게시물들 넣어줌
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts(); // 위에서 정의한 함수 작동
  }, []);

  const handleDelete = (postId) => {
    // Post.jsx에 전달해줄 함수
    setPosts(posts.filter((post) => post.id !== postId)); // 받은 postId와 post.id가 일차하지 않는 post들로만 posts 배열 생성
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

  const openPostDetail = (post) => {
    // console.log("openPostDetail 들어옴!");
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <h2>Home</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onClick={() => openPostDetail(post)}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={closePostDetail}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Home;
