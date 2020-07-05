const router = require('express').Router();
const authChecker = require('../middleware/authChecker');

const profileController = require('../controllers/profileController');
const permissionsChecker = require('../middleware/permissionsChecker');

router
  .route('/')
  .get(
    authChecker,
    permissionsChecker.restrictTo('admin'),
    profileController.view
  );

module.exports = router;
