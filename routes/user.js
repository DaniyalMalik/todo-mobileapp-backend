const express = require('express'),
  router = express.Router(),
  {
    getMe,
    updateMe,
  } = require('../controllers/user'),
  protect = require('../middleware/auth');

router.route('/me').get(protect, getMe).put(protect, updateMe);

module.exports = router;
