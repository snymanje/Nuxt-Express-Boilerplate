const router = require('express').Router();
const authChecker = require('../middleware/authChecker');
const localAuth = require('../middleware/localAuth')
const localSignup = require('../middleware/localSignup')
const refreshTokenAuth = require('../middleware/refreshTokenAuth')
const googleAuth = require('../middleware/googleAuth')

const authController = require('../controllers/authController');

router.post('/signup', localSignup, authController.signup);
router.post('/login', localAuth, authController.login);
router.post('/logout', authController.logout);
router.post('/tokenRefresh', refreshTokenAuth, authController.tokenRefresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authChecker, authController.updatePassword);

router.post('/google', googleAuth, authController.googleLogin);

module.exports = router;