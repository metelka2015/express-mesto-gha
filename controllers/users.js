/* eslint-disable max-len */
/* eslint-disable import/order */
const userModel = require('../models/user');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const NotFoundError = require('../utils/errors/notFoundError');

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => userModel.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((r) => res.status(HTTP_STATUS_OK).send(r))
    .catch(next);
};

const updateUserById = (req, res, next) => userModel.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

const getCurrentUser = (req, res, next) => userModel.findById({ _id: req.user._id })
  .orFail(() => {
    throw new NotFoundError('Пользователь не найден');
  })
  .then((user) => res.status(HTTP_STATUS_OK).send({
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
  }))
  .catch(next);

const updateAvatarById = (req, res, next) => userModel.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(HTTP_STATUS_CREATED).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  createUser,
  getCurrentUser,
};
