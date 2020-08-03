const router = require('express').Router();
const authenticate = require('../middleware/authenticate');

const userController = require('../controllers/userController');

router.get('/getCurrentUser', authenticate, userController.getCurrentUser);

module.exports = router;
