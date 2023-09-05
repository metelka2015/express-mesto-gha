const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatarById);
router.patch('/users/me', updateUserById);
router.get('/users/:userId', getUserById);

module.exports = router;
