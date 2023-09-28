const express = require('express'),
  router = express.Router(),
  {
    getAllUsersList,
    getMe,
    updateMe,
  } = require('../controllers/user'),
  protect = require('../middleware/auth');

router.get('/', protect, getAllUsersList);
router.route('/me').get(protect, getMe).put(protect, updateMe);

module.exports = router;
