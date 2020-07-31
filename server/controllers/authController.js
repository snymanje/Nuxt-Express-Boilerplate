/* eslint-disable prettier/prettier */
const AppError = require('../utils/appError');
const authService = require('../services/authService');
const {
  setAuthCookies,
  updateTokenCookie,
  clearAuthCookies,
} = require('../utils/setCookies');

const sendResponse = async (res, statusCode, status, message, data) => {
  await res.status(statusCode).json({
    status,
    message,
    data,
  });
};

exports.googleSignUp = async (req, res, next) => {
  const { user, activationToken } = await authService.googleSignup(req.body);
  await authService.sendAccountActivationEmail(
    user,
    activationToken,
    req.protocol
  );
  await sendResponse(res, 201, true, 'Activation email sent.', null);
};

exports.signup = async (req, res, next) => {
  const { user, activationToken } = await authService.signup(req.body);
  await authService.sendAccountActivationEmail(
    user,
    activationToken,
    req.protocol
  );
  await sendResponse(res, 201, true, 'Activation email sent.', null);
};

exports.googleLogin = async (req, res, next) => {
  const user = await authService.googleSignIn(req.body);
  const tokens = await authService.generateTokens(user);
  setAuthCookies(res, tokens);
  await sendResponse(res, 200, true, 'Logged in successfully!', user);
};

exports.login = async (req, res, next) => {
  const user = await authService.localLogin(req.body);
  const tokens = await authService.generateTokens(user);
  setAuthCookies(res, tokens);
  await sendResponse(res, 200, true, 'Logged in successfully!', user);
};

exports.logout = async (req, res, next) => {
  await authService.logout(req.body);
  clearAuthCookies(res);
  await sendResponse(res, 200, true, 'You logged out successfully!', null);
};

exports.activateAccount = async (req, res, next) => {
  const user = await authService.activateAccount(req.params.activationToken);
  const tokens = await authService.generateTokens(user);
  setAuthCookies(res, tokens);
  await sendResponse(res, 200, true, 'Account Activated!', user);
};

exports.tokenRefresh = async (req, res, next) => {
  let refreshToken;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    refreshToken = authorization.split(' ')[1];
  } else if (
    req.cookies.refreshTokenSignature &&
    req.cookies.refreshTokenPayload
  ) {
    refreshToken = `${req.cookies.refreshTokenPayload}.${req.cookies.refreshTokenSignature}`;
  }

  if (!refreshToken) {
    return next(new AppError('No refresh token found', 401));
  }

  const user = await authService.refreshToken(refreshToken);
  const token = await authService.generateAccessToken(user);
  updateTokenCookie(res, token);
  await sendResponse(res, 200, true, 'Reissued access token.', user);
};

exports.forgotPassword = async (req, res, next) => {
  const { user, resetToken } = await authService.createPwdResetToken(req.body);
  await authService.sendForgotPwdEmail(user, resetToken, req.protocol);
  await sendResponse(res, 200, true, 'Password Reset email sent!', user);
};

exports.resetPassword = async (req, res, next) => {
  const user = await authService.resetPassword(req.body, req.params.token);
  const tokens = await authService.generateTokens(user);
  setAuthCookies(res, tokens);
  await sendResponse(res, 200, true, 'Password reset successful', user);
};

exports.updatePassword = async (req, res, next) => {
  const user = await authService.updatePassword(req.body);
  const tokens = await authService.generateTokens(user);
  setAuthCookies(res, tokens);
  await sendResponse(res, 200, true, 'Password updated successfully', user);
};
