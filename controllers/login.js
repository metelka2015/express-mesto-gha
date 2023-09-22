// eslint-disable-next-line import/order
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { HTTP_STATUS_OK } = require('http2').constants;

const UnauthorizedError = require('../utils/errors/unauthtorizedError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }

      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.status(HTTP_STATUS_OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { login };
