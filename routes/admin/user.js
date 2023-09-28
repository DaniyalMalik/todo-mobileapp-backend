const express = require('express'),
  router = express.Router(),
  {
    getAllUsersWithPagination,
    getUser,
    updateUser,
    getAllUsersList,
  } = require('../../controllers/admin/user'),
  { protectAdmin } = require('../../middleware/auth');

router.get('/', protectAdmin, getAllUsersWithPagination);
router.get('/list', protectAdmin, getAllUsersList);
router.route('/:id').get(protectAdmin, getUser).put(protectAdmin, updateUser);

module.exports = router;
