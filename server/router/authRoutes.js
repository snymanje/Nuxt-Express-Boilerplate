const router = require('express').Router();
const authChecker = require('../middleware/authChecker');
const localAuth = require('../middleware/authStrategies/localAuth');
const googleAuth = require('../middleware/authStrategies/googleAuth');
const googleSignup = require('../middleware/authStrategies/googleSignup');
const localSignup = require('../middleware/authStrategies/localSignup');
const refreshTokenAuth = require('../middleware/refreshTokenAuth');
const resetPassword = require('../middleware/resetPassword');
const updatePassword = require('../middleware/updatePassword');
const forgotPasswordToken = require('../middleware/forgotPasswordToken');
const createAuthJWTCookies = require('../middleware/createJWTCookies');
const removeCookies = require('../middleware/removeCookies');
const activation = require('../middleware/activateAccount');


const authController = require('../controllers/authController');

router.post('/signup', localSignup, authController.signup);
router.post('/login', localAuth, createAuthJWTCookies, authController.login);
router.post('/logout', removeCookies, authController.logout);
router.post('/activate/:activationToken', activation, authController.activateAccount);

// Review refresh tokens later
router.post('/tokenRefresh', refreshTokenAuth, createAuthJWTCookies, authController.tokenRefresh);

router.post('/forgotPassword', forgotPasswordToken, authController.forgotPassword);
router.patch('/resetPassword/:token', resetPassword, createAuthJWTCookies, authController.resetPassword);
router.patch('/updateMyPassword', authChecker, updatePassword, createAuthJWTCookies, authController.updatePassword);

router.post('/googleSignup', googleSignup, authController.googleSignup);
router.post('/googleLogin', googleAuth, createAuthJWTCookies, authController.googleLogin);

module.exports = router;