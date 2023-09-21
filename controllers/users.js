/* eslint-disable max-len */
/* eslint-disable import/order */
const userModel = require('../models/user');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const getUsers = (req, res) => userModel.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((r) => res.status(HTTP_STATUS_OK).send(r))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }

      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateUserById = (req, res) => userModel.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

const getCurrentUser = (req, res) => userModel.findOne(req.user)
  .then((user) => res.status(HTTP_STATUS_OK).send(user))
  .catch((err) => {
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

const updateAvatarById = (req, res) => userModel.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
        }
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  createUser,
  getCurrentUser,
};
