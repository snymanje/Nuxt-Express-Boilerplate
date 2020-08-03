const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const {
  localAuthSchema,
  logoutSchema,
  signUpSchema,
  googleTokenSchema,
  passwordResetSchema,
  passwordUpdateSchema,
} = require('../models/validationSchemas');

const authController = require('../controllers/authController');

router.post('/signup', validate(signUpSchema), authController.signup);
router.post('/login', validate(localAuthSchema), authController.login);
router.post('/logout', validate(logoutSchema), authController.logout);
router.post('/activate/:activationToken', authController.activateAccount);

// Review refresh tokens later
router.post('/tokenRefresh', authController.tokenRefresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/resetPassword/:token',
  validate(passwordResetSchema),
  authController.resetPassword
);
router.patch(
  '/updateMyPassword',
  validate(passwordUpdateSchema),
  authenticate,
  authController.updatePassword
);

router.post(
  '/googleSignup',
  validate(googleTokenSchema),
  authController.googleSignUp
);
router.post(
  '/googleLogin',
  validate(googleTokenSchema),
  authController.googleLogin
);

module.exports = router;
