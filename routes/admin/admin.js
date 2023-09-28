const express = require('express'),
  router = express.Router(),
  {
    updateAdmin,
    getAdmin,
    getAllAdmins,
    createAdmin,
  } = require('../../controllers/admin/admin'),
  { protectAdmin } = require('../../middleware/auth');

router
  .route('/')
  .get(protectAdmin, getAllAdmins)
  .post(protectAdmin, createAdmin);
router.route('/:id').get(protectAdmin, getAdmin).put(protectAdmin, updateAdmin);

module.exports = router;
