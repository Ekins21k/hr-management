const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Путь к базе данных
const dbDir = path.join(__dirname, "../database");
const dbFile = path.join(dbDir, "database.sqlite");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Ошибка при подключении к БД:", err.message);
  } else {
    console.log("✅ Подключение к SQLite установлено");
    initializeDatabase();
  }
});

function initializeDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS roster (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      skills TEXT NOT NULL,
      team TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      shift TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES roster(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL
    );
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error("❌ Ошибка при создании таблиц:", err.message);
    } else {
      console.log("✅ Таблицы созданы (если их не было)");
      insertInitialData();
    }
  });
}

function insertInitialData() {
  db.get("SELECT COUNT(*) AS count FROM roster", (err, row) => {
    if (err) {
      console.error("Ошибка при проверке данных:", err.message);
      return;
    }
    if (row.count === 0) {
      const insertSql = `
        INSERT INTO roster (name, position, department, skills, team) VALUES
        ('Виталий Дацук', 'Менеджер', 'Управление', 'Лидерство, Планирование', 'Команда A');
      `;
      db.exec(insertSql, (err) => {
        if (err) {
          console.error("❌ Ошибка при вставке данных:", err.message);
        } else {
          console.log("✅ Таблицы успешно заполнены начальными данными");
        }
      });
    }
  });
}

app.use(cors());
app.use(express.json());

// API для roster
app.get("/api/roster", (req, res) => {
  db.all("SELECT * FROM roster", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/roster", (req, res) => {
  const { name, position, department, skills, team } = req.body;
  db.run("INSERT INTO roster (name, position, department, skills, team) VALUES (?, ?, ?, ?, ?)", [name, position, department, skills, team], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, position, department, skills, team });
  });
});

app.put("/api/roster/:id", (req, res) => {
  const { id } = req.params;
  const { name, position, department, skills, team } = req.body;
  db.run("UPDATE roster SET name = ?, position = ?, department = ?, skills = ?, team = ? WHERE id = ?", [name, position, department, skills, team, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updatedID: id, name, position, department, skills, team });
  });
});

app.delete("/api/roster/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM roster WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// API для schedule
app.get("/api/schedule", (req, res) => {
  const query = `
    SELECT schedule.id, roster.name, schedule.shift 
    FROM schedule
    JOIN roster ON schedule.employee_id = roster.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/schedule", (req, res) => {
  const { employee_id, shift } = req.body;
  db.run("INSERT INTO schedule (employee_id, shift) VALUES (?, ?)", [employee_id, shift], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, employee_id, shift });
  });
});

app.put("/api/schedule/:id", (req, res) => {
  const { id } = req.params;
  const { employee_id, shift } = req.body;
  db.run("UPDATE schedule SET employee_id = ?, shift = ? WHERE id = ?", [employee_id, shift, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updatedID: id, employee_id, shift });
  });
});

app.delete("/api/schedule/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM schedule WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// API для tasks
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, completed } = req.body;
  db.run("INSERT INTO tasks (title, completed) VALUES (?, ?)", [title, completed], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, completed });
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updatedID: id, completed });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Ошибка при закрытии БД:", err.message);
    }
    console.log("📴 Подключение к БД закрыто");
    process.exit(0);
  });
});