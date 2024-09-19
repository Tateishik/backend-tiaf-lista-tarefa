const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
   res.send('Hello World');
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lista-tarefas.db');

// Cria a tabela 'tarefas' no banco de dados
db.serialize(() => {
   db.run("CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY, tarefa TEXT)");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//Rota para Adicionar uma Nova Tarefa
app.post('/tarefas', (req, res) => {
   const { tarefa } = req.body;
   db.run("INSERT INTO tarefas (tarefa) VALUES (?)", [tarefa], function(err) {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       res.status(201).json({ id: this.lastID, tarefa });
   });
});

// Rota para Obter Todas as Tarefas
app.get('/tarefas', (req, res) => {
   db.all("SELECT * FROM tarefas", [], (err, rows) => {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       res.status(200).json(rows);
   });
});


//Rota para Obter uma Tarefa Específica
app.get('/tarefas/:id', (req, res) => {
   const { id } = req.params;
   db.get("SELECT * FROM tarefas WHERE id = ?", [id], (err, row) => {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       if (row) {
           res.status(200).json(row);
       } else {
           res.status(404).json({ error: 'Tarefa não encontrada!' });
       }
   });
});

//Rota para Editar uma Tarefa Existente
app.put('/tarefas/:id', (req, res) => {
   const { id } = req.params;
   const { tarefa } = req.body;
   db.run("UPDATE tarefas SET tarefa = ? WHERE id = ?", [tarefa, id], function(err) {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       if (this.changes) {
           res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
       } else {
           res.status(404).json({ error: 'Tarefa não encontrada!' });
       }
   });
});

//Rota para Excluir uma Tarefa
app.delete('/tarefas/:id', (req, res) => {
   const { id } = req.params;
   db.run("DELETE FROM tarefas WHERE id = ?", [id], function(err) {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       if (this.changes) {
           res.status(200).json({ message: 'Tarefa removida com sucesso!' });
       } else {
           res.status(404).json({ error: 'Tarefa não encontrada!' });
       }
   });
});
