// Import packages
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// Create Express app
const app = express();
const PORT = 3000;

// Middleware to handle JSON requests
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./university.db", (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log("Connected to university.db");
});

// Home route
app.get("/", (req, res) => {
  res.send("Course API is running");
});

// GET all courses
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM courses";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// GET course by id
app.get("/api/courses/:id", (req, res) => {
  const sql = "SELECT * FROM courses WHERE id = ?";

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(row);
  });
});

// POST new course
app.post("/api/courses", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    INSERT INTO courses
    (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [courseCode, title, credits, description, semester],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Course added successfully",
        id: this.lastID
      });
    }
  );
});

// PUT update course
app.put("/api/courses/:id", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    UPDATE courses
    SET courseCode = ?,
        title = ?,
        credits = ?,
        description = ?,
        semester = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      courseCode,
      title,
      credits,
      description,
      semester,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Course updated successfully",
        changes: this.changes
      });
    }
  );
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {
  const sql = "DELETE FROM courses WHERE id = ?";

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Course deleted successfully",
      changes: this.changes
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});