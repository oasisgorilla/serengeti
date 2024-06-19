const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "db", "mydatabase.sqlite"); // 경로 설정
const db = new sqlite3.Database(dbPath); // 파일 기반 SQLite 데이터베이스

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, authorId INTEGER, FOREIGN KEY(authorId) REFERENCES users(id))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, content TEXT, authorId INTEGER, FOREIGN KEY(postId) REFERENCES posts(id), FOREIGN KEY(authorId) REFERENCES users(id))"
  );
  // 좋아요 기능
  db.run(
    "CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT,postId INTEGER, userId INTEGER, FOREIGN KEY(postId) REFERENCES posts(id), FOREIGN KEY(userId) REFERENCES users(id))"
  );
});

module.exports = db;
