'use strict';

// Load array of notes
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');

const { PORT } = require('./config');

const app = express();

const morgan = require('morgan');

const router = require('./router/notes.router');

app.use(express.static('public'));

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/notes',router);


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
