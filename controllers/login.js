// eslint-disable-next-line import/order
const userModel = require('../models/user');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;

// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Email или пароль не могут быть пустыми' });
  }

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не найден' });
      }

      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем
            return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.status(HTTP_STATUS_OK).send({ token });
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { login };
