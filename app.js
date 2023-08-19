const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

//Get all notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({ notes: rows });
    }
  });
});

// Get a single note by ID
app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM notes WHERE id = ?', id, (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({ note: row });
    }
  });
});

// Create a new note
app.post('/notes', (req, res) => {
  const content = req.body.content;
  if (!content) {
    res.status(400).send({ error: 'Content is missing' });
  };

  db.run('INSERT INTO notes (content) VALUES (?)', content, function(err) {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({ noteId: this.lastID });
    }
  });
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM notes WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({ rowsDeleted: this.changes });
    }
  });
});

// Update a note by ID
app.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const content = req.body.content;
  if (!content) {
    res.status(400).send({ error: 'Content is missing' });
  };

  db.run('UPDATE notes SET content = ? WHERE id = ?', [content, id], function(err) {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({ rowsUpdated: this.changes });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});