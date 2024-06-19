import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home"; // 홈
import WritePost from "./pages/WritePost"; // 게시글 작성
import Signup from "./pages/Signup"; // 회원가입
import Mypage from "./pages/Mypage"; // 마이페이지
import "./App.css";
import bannerImage from "./assets/serengeti.jpg";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보를 가져와서 setUser로 설정
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 로그인 상태를 체크하는 함수
  const isLoggedIn = () => {
    return !!user; // user가 존재하면 true, 없으면 false 반환
  };

  return (
    <Router>
      <div>
        <header className="banner">
          <div className="overlay">
            <h1>Serengeti</h1>
          </div>
        </header>
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/write">Write Post</Link>
          {isLoggedIn() && <Link to="/mypage">MyPage</Link>}
          <div className="login-container">
            {!isLoggedIn() && <Link to="/login">Login</Link>}
            {isLoggedIn() && <Link to="/logout">Logout</Link>}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WritePost user={user} />} />
          <Route path="/mypage" element={<Mypage user={user} />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

function Logout({ setUser }) {
  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
    console.log("log out");
  }, []);

  return <Navigate to="/login" />;
}

export default App;
