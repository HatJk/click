const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Banco de dados SQLite
const db = new sqlite3.Database('./cookie.db');
db.run("CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY, clicks INTEGER)");
db.run("INSERT OR IGNORE INTO progress (id, clicks) VALUES (1, 0)");

// Interface HTML do Reimu Fumo Clicker com efeito Squish
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reimu Fumo Clicker</title>
      <style>
        body {
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #fce8e8;
          color: #333;
          margin: 0;
          padding-top: 50px;
          user-select: none;
        }

        h1 {
          color: #d32f2f;
          margin-bottom: 5px;
        }

        p {
          color: #666;
          font-size: 1.1rem;
        }

        .fumo-container {
          margin: 30px auto;
          display: inline-block;
          cursor: pointer;
        }

        /* Imagem do Fumo com transição suave */
        .fumo-img {
          width: 260px;
          height: auto;
          transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.15));
        }

        /* Efeito Squish (achata e encolhe na cabeça ao clicar) */
        .fumo-img:active, .fumo-img.squish {
          transform: scale(0.85, 0.7) translateY(20px);
        }

        .counter-box {
          background-color: #fff;
          display: inline-block;
          padding: 15px 30px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          font-size: 1.4rem;
          font-weight: bold;
          color: #b71c1c;
        }

        #count {
          font-size: 1.8rem;
          color: #d32f2f;
        }
      </style>
    </head>
    <body>
      <h1>⛩️ Reimu Fumo Clicker ⛩️</h1>
      <p>Clique no Fumo pra adora-lo</p>

      <div class="fumo-container" onclick="patReimu()">
        <img id="fumo" class="fumo-img" src="https://gifdb.com/images/high/reimu-fumo-touhou-bounce-00k88vd3664s626f.gif" alt="Reimu Fumo">
      </div>

      <br>

      <div class="counter-box">
        Carinhos realizados: <span id="count">0</span> ❤️
      </div>

      <script>
        const fumo = document.getElementById('fumo');

        async function load() {
          const res = await fetch('/api/score');
          const data = await res.json();
          document.getElementById('count').innerText = data.clicks;
        }

        async function patReimu() {
          // Adiciona animação de squish via classe
          fumo.classList.add('squish');
          setTimeout(() => fumo.classList.remove('squish'), 100);

          // Envia o clique para o servidor
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

// APIs para ler e atualizar progresso
app.listen(port, () => console.log(`Rodando na porta ${port}`));