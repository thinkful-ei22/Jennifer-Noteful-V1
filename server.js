'use strict';

// Load array of notes
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');

const data = require('./db/notes');

const { PORT } = require('./config');

const app = express();

const {requestLogger} = require('./middleware/logger');

app.use(express.static('public'));

app.use(requestLogger);

app.get('/api/notes', (req, res) => {
  const query = req.query;
  const searchTerm = query.searchTerm;
  if (!searchTerm){
    return res.json(data);
  }
  const result = data.filter(item=>{
    if (item.title.includes(searchTerm)||item.content.includes(searchTerm)){
      return item;
    }
  });
  res.json(result);
});

app.get('/api/notes/:id', (req, res)=>{
  const id = req.params.id;
  const result = data.find(item=>item.id===Number(id));
  res.json(result);
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
