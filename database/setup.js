const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./university.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to university.db");
});

db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    semester TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log("Courses table created successfully.");

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Database connection closed.");
  });
});