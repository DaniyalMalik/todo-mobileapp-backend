const express = require('express'),
  router = express.Router(),
  {
    register,
    login,
    socialLogin,
    getMe,
    // verifyEmail,
    // forgotPassword,
    resetPassword,
    // sendEmail,
    updateMe,
    updateReviewAndRating,
    changePassword,
    // verifyPhoneNumber,
    // sendMessage,
  } = require('../../controllers/user/authUser'),
  { protect } = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/sociallogin', socialLogin);
// router.post('/verifyemail', protect, verifyEmail);
// router.post('/verifymessage', protect, verifyPhoneNumber);
// router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/password', protect, changePassword);
router.put('/review', protect, updateReviewAndRating);
// router.get('/verifyemail', protect, sendEmail);
// router.get('/verifymessage', protect, sendMessage);

module.exports = router;
