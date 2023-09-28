const express = require('express'),
    router = express.Router(),
    {
        register,
        login,
        socialLogin,
        changePassword,
    } = require('../controllers/auth'),
    protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/sociallogin', socialLogin);
router.put('/password', protect, changePassword);

module.exports = router;
