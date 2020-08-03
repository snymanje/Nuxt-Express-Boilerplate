const router = require('express').Router();
const authenticate = require('../middleware/authenticate');

const profileController = require('../controllers/profileController');
const authorize = require('../middleware/authorize');

router
  .route('/')
  .get(authenticate, authorize.restrictTo('admin'), profileController.view);

module.exports = router;
