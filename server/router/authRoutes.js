const router = require('express').Router();
const authChecker = require('../middleware/authChecker');
const localAuth = require('../middleware/authStrategies/localAuth');
const localSignup = require('../middleware/authStrategies/localSignup');
const refreshTokenAuth = require('../middleware/refreshTokenAuth');
const resetPassword = require('../middleware/resetPassword');
const updatePassword = require('../middleware/updatePassword');
const forgotPasswordToken = require('../middleware/forgotPasswordToken');
const createAuthJWTCookies = require('../middleware/createJWTCookies');
const removeCookies = require('../middleware/removeCookies');
const googleAuth = require('../middleware/authStrategies/googleAuth');

const authController = require('../controllers/authController');

router.post('/signup', localSignup, createAuthJWTCookies, authController.signup);
router.post('/login', localAuth, createAuthJWTCookies, authController.login);
router.post('/logout', removeCookies, authController.logout);

// Review refresh tokens later
router.post('/tokenRefresh', refreshTokenAuth, createAuthJWTCookies, authController.tokenRefresh);

router.post('/forgotPassword', forgotPasswordToken, authController.forgotPassword);
router.patch('/resetPassword/:token', resetPassword, createAuthJWTCookies, authController.resetPassword);
router.patch('/updateMyPassword', authChecker, updatePassword, createAuthJWTCookies, authController.updatePassword);

router.post('/google', googleAuth, createAuthJWTCookies, authController.googleLogin);

module.exports = router;