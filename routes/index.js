const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Page not found' });
  next();
});

module.exports = router;
