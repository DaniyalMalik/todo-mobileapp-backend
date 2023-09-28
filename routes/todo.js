const express = require('express'),
    router = express.Router(),
    {
        getUser,
        updateUser,
        getAllUsersList,
        register,
        login,
        socialLogin,
        getMe,
        forgotPassword,
        resetPassword,
        updateMe,
        changePassword,
    } = require('../controllers/user'),
    protect = require('../middleware/auth');

router.get('/', protect, getAllUsersList);
router.route('/:id').get(protect, getUser).put(protect, updateUser);
router.post('/register', register);
router.post('/login', login);
router.post('/sociallogin', socialLogin);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.route('/me').get(protect, getMe).put(protect, updateMe);
router.put('/password', protect, changePassword);

module.exports = router;
