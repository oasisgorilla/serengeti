const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const db = require("./db");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    store: new SQLiteStore(),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// 로그인 엔드포인트
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (user) {
        req.session.user = user;
        res.json({ user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

// 게시물 생성 엔드포인트
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title, content });
    }
  );
});

// 게시물 목록 가져오기 엔드포인트
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 게시물 삭제 엔드포인트
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM posts WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

// 댓글 작성 엔드포인트
app.post("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.run(
    "INSERT INTO comments (postId, content) VALUES (?, ?)",
    [id, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, postId: id, content });
    }
  );
});

// 댓글 목록 가져오기 엔드포인트
app.get("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM comments WHERE postId = ?", id, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 회원가입 엔드포인트 추가
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  // 예외 처리: 이미 존재하는 사용자인지 확인
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (user) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // 사용자 추가
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
