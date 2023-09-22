// eslint-disable-next-line linebreak-style
/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regExp } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regExp),
  }),
}), updateAvatarById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserById);

router.get('/:userId', celebrate({
  params: Joi.object().keys({ userId: Joi.string().required().length(24).hex() }),
}), getUserById);

module.exports = router;
