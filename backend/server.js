const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const db = require("./db");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // 클라이언트 URL
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    store: new SQLiteStore({ db: "mydatabase.sqlite" }),
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
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (user) {
        req.session.user = user;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ user });
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

// 게시물 생성 엔드포인트
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  const { user } = req.session; // 세션에서 사용자 정보를 가져옴

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)",
    [title, content, user.id], // user.id를 통해 사용자 식별자 저장
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title, content, userId: user.id });
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
  const { user } = req.session; // 세션에서 사용자 정보를 가져옴

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "DELETE FROM posts WHERE id = ? AND authorId = ?",
    [id, user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      res.status(204).send();
    }
  );
});

// 게시물 수정 엔드포인트
app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { user } = req.session; // 세션에서 사용자 정보를 가져옴

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "UPDATE posts SET title = ?, content = ? WHERE id = ? AND authorId = ?",
    [title, content, id, user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      res.json({ id, title, content, userId: user.id });
    }
  );
});

// 댓글 작성 엔드포인트 수정
app.post("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "INSERT INTO comments (postId, content, authorId) VALUES (?, ?, ?)",
    [id, content, user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, postId: id, content, authorId: user.id });
    }
  );
});

// 댓글 목록 가져오기 엔드포인트 수정
app.get("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  db.all(
    "SELECT comments.*, users.username AS author FROM comments JOIN users ON comments.authorId = users.id WHERE postId = ?",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
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

// 비밀번호 변경
app.post("/api/change-password", (req, res) => {
  const { username, newPassword } = req.body;
  console.log("hi", req.session.user);
  // 예외 처리: 사용자가 로그인 되어 있는지 확인
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 비밀번호 변경
  db.run(
    "UPDATE users SET password = ? WHERE username = ?",
    [newPassword, username],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Password updated successfully" });
    }
  );
});

// 좋아요 수 가져오기 엔드포인트
app.get("/api/posts/:id/likes", (req, res) => {
  const { id } = req.params;
  db.get(
    "SELECT COUNT(*) as likeCount FROM likes WHERE postId = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    }
  );
});

// 좋아요 추가 엔드포인트
app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "INSERT INTO likes (postId, userId) VALUES (?, ?)",
    [id, user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Post liked successfully" });
    }
  );
});

// 좋아요 취소 엔드포인트
app.delete("/api/posts/:id/unlike", (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.run(
    "DELETE FROM likes WHERE postId = ? AND userId = ?",
    [id, user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Post unliked successfully" });
    }
  );
});

// 사용자가 좋아요를 누른 게시물 목록 엔드포인트
app.get("/api/users/:id/liked-posts", (req, res) => {
  const { id } = req.params;
  db.all(
    "SELECT posts.* FROM posts JOIN likes ON posts.id = likes.postId WHERE likes.userId = ?",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
