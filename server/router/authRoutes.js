const router = require('express').Router();
const authChecker = require('../middleware/authChecker');

const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/tokenRefresh', authController.tokenRefresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authChecker, authController.updatePassword);

module.exports = router;