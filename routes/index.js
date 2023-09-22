/* eslint-disable linebreak-style */
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { auth } = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Page not found' });
  next();
});

module.exports = router;
