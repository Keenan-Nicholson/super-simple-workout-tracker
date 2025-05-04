import express from "express";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

// create a table "workouts" if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  exercises TEXT NOT NULL
)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS logged_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    name TEXT NOT NULL,
    reps INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    rest INTEGER NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
  );
  `
);

app.post("/workouts", (req, res) => {
  const { workoutName, exercises } = req.body;

  if (!workoutName || !exercises) {
    return res.status(400).json({ error: "Name and exercises are required" });
  }

  db.run(
    `INSERT INTO workouts (name, exercises) VALUES (?, ?)`,
    [workoutName, JSON.stringify(exercises)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, workoutName, exercises });
    }
  );
});

app.get("/workouts", (req, res) => {
  db.all(`SELECT * FROM workouts`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/logged_sets", (req, res) => {
  const workoutEntries = req.body;
  if (!Array.isArray(workoutEntries) || workoutEntries.length === 0) {
    return res
      .status(400)
      .json({ error: "Expected an array of workout entries" });
  }

  const stmt = db.prepare(`
    INSERT INTO logged_sets (workout_id, date, name, reps, weight, rest)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const entry of workoutEntries) {
    const { ["workout-id"]: workoutId, date, name, reps, weight, rest } = entry;

    console.log(name);
    if (
      !workoutId ||
      !date ||
      !name ||
      reps == null ||
      weight == null ||
      rest == null
    ) {
      console.error("Invalid entry:", entry);
      return res.status(400).json({ error: "Invalid entry" });
    }

    stmt.run(workoutId, date, name, reps, weight, rest);
  }
  console.log("Workout sets logged successfully");
  stmt.finalize((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Workout sets logged successfully" });
  });
});

app.get("/logged_sets", (req, res) => {
  db.all(`SELECT * FROM logged_sets`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/delete_sets", (req, res) => {
  const { "workout-id": workoutId, date } = req.body;

  if (!workoutId) {
    return res.status(400).json({ error: "Workout ID is required" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const formattedDate = date.split("T")[0];

  db.run(
    `DELETE FROM logged_sets WHERE workout_id = ? AND date LIKE ?`,
    [workoutId, `${formattedDate}%`],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }
      res.json({ message: "Workout deleted successfully" });
    }
  );
});
