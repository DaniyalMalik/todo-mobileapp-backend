const express = require('express'),
    router = express.Router(),
    {
        register,
        login,
        socialLogin,
        forgotPassword,
        resetPassword,
        changePassword,
    } = require('../controllers/user'),
    protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/sociallogin', socialLogin);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.put('/password', protect, changePassword);

module.exports = router;
