/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to DB');
});

const app = express();
const port = 3000;
app.use(express.json());

// мидлвэр временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64f5cd93b0d63bb0fe8edf62',
  };

  next();
});

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
