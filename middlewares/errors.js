const conflictError = require('../utils/errors/conflictError');
const validationError = require('../utils/errors/validationError');
const notFoundError = require('../utils/errors/notFoundError');
const unauthorizedError = require('../utils/errors/unauthtorizedError');
const forbiddenError = require('../utils/errors/forbiddenError');

const handleError = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(validationError.statusCode)
      .send({ message: validationError.message });
    return;
  }



  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = handleError;