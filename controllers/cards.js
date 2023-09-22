/* eslint-disable max-len */
const cardModel = require('../models/card');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
// eslint-disable-next-line import/order
} = require('http2').constants;
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const createCard = (req, res, next) => cardModel.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
  .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
  .catch(next);

const getCards = (req, res, next) => cardModel.find({})
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch(next);

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return cardModel.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Card not found');
    })
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      cardModel.findByIdAndRemove(cardId)
        .orFail(() => {
          throw new NotFoundError('Card not found');
        })
        .then(() => {
          res.status(HTTP_STATUS_OK).send(card);
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('Card not found');
  })
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch(next);

const dislikeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('Card not found');
  })
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
