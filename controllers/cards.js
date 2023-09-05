/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable import/order */
const cardModel = require('../models/card');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const createCard = (req, res) => cardModel.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
  .then((r) => res.status(HTTP_STATUS_CREATED).send(r))
  .catch((err) => {
    console.log(err);
    if (err.name === 'ValidationError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

const getCards = (req, res) => cardModel.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndRemove(cardId)
    .then((user) => {
      if (user === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send('User not found');
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((user) => {
    if (user === null) {
      return res.status(HTTP_STATUS_NOT_FOUND).send('User not found');
    }
    return res.status(HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
    }

    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

const dislikeCard = (req, res) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((user) => {
    if (user === null) {
      return res.status(HTTP_STATUS_NOT_FOUND).send('User not found');
    }
    return res.status(HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
    }

    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
