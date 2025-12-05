const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('guestbook.db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database
db.exec(`CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  message TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)`);

app.post('/api/entries', (req, res) => {
  const { name = '', message = '' } = req.body;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';

  const sql = `INSERT INTO entries (name, message, ip, user_agent) 
               VALUES ('${name}', '${message}', '${ip}', '${ua}')`;
  try {
    db.exec(sql);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'SQL error' });
  }
});

// returns everything
app.get('/api/entries', (req, res) => {
  const rows = db.prepare('SELECT id, name, message, ip, user_agent FROM entries ORDER BY id DESC').all();
  res.json(rows);
});

// delete
app.delete('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM entries WHERE id = ?').run(id);
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log('INSECURE backend running → http://localhost:5000');
});