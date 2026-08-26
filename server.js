const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Conecta ao banco SQLite (cria o arquivo automaticamente)
const db = new sqlite3.Database('./cookie.db');
db.run("CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY, clicks INTEGER)");
db.run("INSERT OR IGNORE INTO progress (id, clicks) VALUES (1, 0)");

// Front-end embutido (Reimu Fumo Clicker)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reimu Fumo Clicker</title>
      <style>
        body { text-align: center; font-family: sans-serif; padding-top: 40px; background-color: #fdf2f2; }
        .fumo-btn { font-size: 80px; background: none; border: none; cursor: pointer; transition: transform 0.1s; }
        .fumo-btn:active { transform: scale(0.9); }
        h1 { color: #cc0000; }
      </style>
    </head>
    <body>
      <h1>⛩️ Reimu Fumo Clicker ⛩️</h1>
      <button class="fumo-btn" onclick="clickFumo()">⛩️</button>
      <h2>Doações: <span id="count">0</span></h2>
      <script>
        async function load() {
          const res = await fetch('/api/score');
          const data = await res.json();
          document.getElementById('count').innerText = data.clicks;
        }
        async function clickFumo() {
          const res = await fetch('/api/click', { method: 'POST' });
          const data = await res.json();
          document.getElementById('count').innerText = data.clicks;
        }
        load();
      </script>
    </body>
    </html>
  `);
});

// APIs para ler e salvar no SQLite
app.get('/api/score', (req, res) => {
  db.get("SELECT clicks FROM progress WHERE id = 1", (err, row) => res.json(row || { clicks: 0 }));
});

app.post('/api/click', (req, res) => {
  db.run("UPDATE progress SET clicks = clicks + 1 WHERE id = 1", function() {
    db.get("SELECT clicks FROM progress WHERE id = 1", (err, row) => res.json(row || { clicks: 0 }));
  });
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));