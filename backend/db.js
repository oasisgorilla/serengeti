const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
  db.run(
    "CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)"
  );
  db.run(
    "CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, content TEXT, FOREIGN KEY(postId) REFERENCES posts(id))"
  );
});

module.exports = db;
