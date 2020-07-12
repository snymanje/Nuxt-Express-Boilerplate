const router = require('express').Router();
const authChecker = require('../middleware/authChecker');

const userController = require('../controllers/userController');

router.get('/getCurrentUser',
    authChecker,
    userController.getCurrentUser
  );

module.exports = router;
