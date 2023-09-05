const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

router.post('/users', createUser);
router.patch('/users/me', updateUserById);
router.patch('/users/me/avatar', updateAvatarById);
router.get('/users/:userID', getUserById);
router.get('/users', getUsers);

module.exports = router;
