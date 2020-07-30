const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signup = async (body) => {
  if (body.password !== body.passwordConfirm) {
    throw new AppError('Password and Confirm Password do not match.', 400);
  }
  const user = await User.create({
    method: 'local',
    'local.name': body.name,
    'local.email': body.email,
    role: body.role,
    'local.password': body.password,
    'local.passwordConfirm': body.passwordConfirm,
  });

  const accountActivationToken = user.createAccountActivationToken();
  await user.save({ validateBeforeSave: false });
  return user;
};

const localLogin = async (body) => {
  const { email, password } = body;
  /* if (!email || !password)
            throw new AppError('Please enter a username and password', 400); */

  const user = await User.findOne({ 'local.email': email }).select(
    '+local.password'
  );

  if (!user || !(await user.correctPassword(password, user.local.password)))
    throw new AppError('Incorrect username or password', 401);

  if (!user.active)
    throw new AppError('You have not activated your account yet', 403);

  // Remove password from object returned
  return user;
};

const generateTokens = async (user) => {
  const { _id } = user;
  const access_token = await jwt.sign({ _id }, process.env.TOKENSECRET, {
    expiresIn: process.env.TOKENEXPIRES,
  });

  const refresh_token = await jwt.sign(
    { _id },
    process.env.REFRESHTOKENSECRET,
    {
      expiresIn: process.env.REFRESHTOKENEXPIRES,
    }
  );

  return {
    access_token,
    refresh_token,
  };
};

module.exports = {
  signup,
  localLogin,
  generateTokens,
};
