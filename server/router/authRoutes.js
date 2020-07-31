const router = require('express').Router();
const authChecker = require('../middleware/authChecker');

const {
  localAuthSchema,
  logoutSchema,
  signUpSchema,
  googleTokenSchema,
} = require('../utils/validationSchemas');
const { validateRequest } = require('../middleware/validateRequest');

const authController = require('../controllers/authController');

router.post('/signup', validateRequest(signUpSchema), authController.signup);
router.post('/login', validateRequest(localAuthSchema), authController.login);
router.post('/logout', validateRequest(logoutSchema), authController.logout);
router.post('/activate/:activationToken', authController.activateAccount);

// Review refresh tokens later
router.post('/tokenRefresh', authController.tokenRefresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authChecker, authController.updatePassword);

router.post(
  '/googleSignup',
  validateRequest(googleTokenSchema),
  authController.googleSignUp
);
router.post(
  '/googleLogin',
  validateRequest(googleTokenSchema),
  authController.googleLogin
);

module.exports = router;
