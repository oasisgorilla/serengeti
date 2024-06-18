import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home"; // 수정된 경로
import WritePost from "./pages/WritePost"; // 수정된 경로
import Signup from "./pages/Signup"; // 회원가입 컴포넌트 추가
import "./App.css";

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
        <header>
          <h1>Serengeti</h1>
          <nav>
            {/* 홈 화면과 게시물 작성 페이지 링크 */}
            <Link to="/">Home</Link>
            <Link to="/write">Write Post</Link>
          </nav>
          <div className="login-container">
            {!isLoggedIn() && <Link to="/login">Login</Link>}
            {isLoggedIn() && <Link to="/logout">Logout</Link>}
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WritePost user={user} />} />
          {/* 로그아웃 처리 */}
          <Route path="/logout" element={<Logout setUser={setUser} />} />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

// 로그아웃 컴포넌트
function Logout({ setUser }) {
  useEffect(() => {
    // 로그아웃 시 로컬 스토리지에서 사용자 정보 삭제
    localStorage.removeItem("user");
    setUser(null); // setUser를 사용하여 user 상태를 null로 설정하고 로그아웃 처리
    console.log("log out");
  }, []);

  return <Navigate to="/login" />;
}

export default App;
