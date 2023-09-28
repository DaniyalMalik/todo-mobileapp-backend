const express = require('express'),
  router = express.Router(),
  {
    getUser,
    updateUser,
    getAllUsersList,
    getMe,
    updateMe,
  } = require('../controllers/user'),
  protect = require('../middleware/auth');

router.get('/', protect, getAllUsersList);
router.route('/:id').get(protect, getUser).put(protect, updateUser);
router.route('/me').get(protect, getMe).put(protect, updateMe);

module.exports = router;
