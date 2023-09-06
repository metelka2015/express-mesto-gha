/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to DB');
});

const app = express();
app.use(express.json());
app.use(helmet());

// мидлвэр временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64f5cd93b0d63bb0fe8edf62',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
