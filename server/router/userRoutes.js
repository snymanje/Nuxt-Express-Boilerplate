const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../utils/roles');

const userController = require('../controllers/userController');

router.get('/getUser', authenticate, userController.getUser);
router.get(
  '/getUsers',
  authenticate,
  authorize.restrictTo(roles.admin),
  userController.getUsers
);

module.exports = router;
