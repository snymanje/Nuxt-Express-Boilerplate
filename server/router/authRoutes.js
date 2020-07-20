const router = require('express').Router();
const authChecker = require('../middleware/authChecker');
const googleAuth = require('../middleware/googleAuth')

const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/tokenRefresh', authController.tokenRefresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authChecker, authController.updatePassword);

router.post('/google', googleAuth, authController.googleLogin);

module.exports = router;