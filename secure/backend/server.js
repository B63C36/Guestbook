const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('guestbook.db');

// security
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// database
db.exec(`CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
)`);

const insert = db.prepare('INSERT INTO entries (name, message) VALUES (?, ?)');
const getAll = db.prepare('SELECT id, name, message, created_at FROM entries ORDER BY created_at DESC');
const deleteById = db.prepare('DELETE FROM entries WHERE id = ?');

// login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === '123secure') {
    req.session.loggedIn = true;
    return res.json({ success: true, message: 'Welcome, User!' });
  }
  res.status(401).json({ success: false, message: 'Wrong username or password' });
});

// login check
const requireLogin = (req, res, next) => {
  if (req.session.loggedIn) return next();
  res.status(401).json({ error: 'Login required' });
};

app.get('/api/entries', (req, res) => {
  res.json(getAll.all());
});

app.post('/api/entries', requireLogin, (req, res) => {
  const { name, message } = req.body;
  if (!name?.trim() || !message?.trim()) return res.status(400).json({ error: 'Required' });
  insert.run(name.trim().substring(0,100), message.trim().substring(0,1000));
  res.json({ success: true });
});

app.delete('/api/entries/:id', requireLogin, (req, res) => {
  deleteById.run(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log('SECURE backend with LOGIN → http://localhost:5000'));