const express = require('express'),
  router = express.Router(),
  {
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateMe,
    register,
    changePassword,
  } = require('../../controllers/admin/authAdmin'),
  { protectAdmin } = require('../../middleware/auth');

router.post('/login', login);
// router.post('/register', register);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.put('/logout', protectAdmin, logout);
router.put('/password', protectAdmin, changePassword);
router.get('/me', protectAdmin, getMe);
router.put('/me', protectAdmin, updateMe);

module.exports = router;
