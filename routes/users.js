const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.patch('/me/avatar', updateAvatarById);
router.patch('/me', updateUserById);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);

module.exports = router;
