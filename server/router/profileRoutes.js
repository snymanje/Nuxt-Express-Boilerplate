const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const roles = require('../utils/roles');

const profileController = require('../controllers/profileController');
const authorize = require('../middleware/authorize');

router
  .route('/')
  .get(authenticate, authorize.restrictTo(roles.admin), profileController.view);

module.exports = router;
