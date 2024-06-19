import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.post("/posts", { title, content });
  //     setPosts([...posts, response.data]);
  //     setTitle("");
  //     setContent("");
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //   }
  // };

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
          posts.map((post) => {
            console.log(post); // post{id: , title: , content: }
            return <Post key={post.id} post={post} />;})
        )}
      </div>
    </div>
  );
}

export default Home;
