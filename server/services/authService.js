const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const sendMail = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');

const activateAccount = async (activationToken) => {
  if (!activationToken) throw new AppError('No Activation token found', 400);

  const hashedToken = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');

  const user = await User.findOne({
    accountActivationToken: hashedToken,
    /* 'local.passwordResetExpires': { $gt: Date.now() }, */
  });

  if (!user) {
    throw new AppError(
      'The user for this token does not exist or this token has expired',
      400
    );
  }

  if (user.active) {
    throw new AppError('This account is already active', 400);
  }

  user.active = true;
  await user.save();

  return user;
};

const googleSignUp = async (body) => {
  const { access_token } = body;

  if (!access_token)
    throw new AppError('The google access token was not provided.', 400);

  const CLIENT_ID = process.env.GOOGLECLIENTID;
  const client = new OAuth2Client(CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: access_token,
    audience: CLIENT_ID,
  });

  const { sub, name, email, picture } = ticket.getPayload();

  // check if the current user exists in the DB
  const existingUser = await User.findOne({ 'google.id': sub });

  if (existingUser && !existingUser.active)
    throw new AppError(
      'You already have an account that is not activated yet',
      403
    );

  if (existingUser && existingUser.active) {
    throw new AppError('You already signed up, go to login', 403);
  }

  // Id user does not exist creat a new one`);
  const newUser = await User.create({
    method: 'google',
    google: {
      id: sub,
      name: name,
      photo: picture,
      email: email,
    },
  });

  const activationToken = newUser.createAccountActivationToken();
  await newUser.save({ validateBeforeSave: false });

  return {
    newUser,
    activationToken,
  };
};

const googleSignIn = async (body) => {
  const { access_token } = body;

  if (!access_token)
    throw new AppError('The google access token was not provided.', 400);

  const CLIENT_ID = process.env.GOOGLECLIENTID;
  const client = new OAuth2Client(CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: access_token,
    audience: CLIENT_ID,
  });

  const { sub, name, email, picture } = ticket.getPayload();

  // check if the current user exists in the DB
  const existingUser = await User.findOne({ 'google.id': sub });

  if (!existingUser) {
    throw new AppError('You have not registerd yet, please go to signup.', 401);
  }

  if (existingUser && !existingUser.active)
    throw new AppError(
      'You already have an account that is not activated yet',
      403
    );

  return existingUser;
};

const signup = async (body) => {
  const user = await User.create({
    method: 'local',
    'local.name': body.name,
    'local.email': body.email,
    role: body.role,
    'local.password': body.password,
    'local.passwordConfirm': body.passwordConfirm,
  });

  const activationToken = user.createAccountActivationToken();
  await user.save({ validateBeforeSave: false });
  return {
    user,
    activationToken,
  };
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

const refreshToken = async (refreshToken) => {
  // verify the token
  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.REFRESHTOKENSECRET
  );
  // Check if user exists
  const loggedInUser = await User.findById(decoded._id);
  if (!loggedInUser) {
    throw new AppError(
      'User for this token nolonger exists, please register',
      401
    );
  }
  // Only do this check if your is signup with local username and password
  // Check if the user changed his password.
  if (loggedInUser.method === 'local') {
    if (loggedInUser.changedPasswordAfter(decoded.iat)) {
      throw new new AppError(
        'Password has changed, please log in again',
        401
      )();
    }
  }

  return loggedInUser;
};

const logout = async (body) => {
  const { _id } = body;
  const user = await User.findOne({ _id });
  if (!user) throw new AppError('User not found', 400);
};

const createPwdResetToken = async (body) => {
  const user = await User.findOne({ 'local.email': body.email });
  if (!user) {
    throw new AppError('A user with this email address does not exist', 401);
  }

  const resetToken = user.createPasswordResettoken();
  await user.save({ validateBeforeSave: false });

  return {
    user,
    resetToken,
  };
};

const resetPassword = async (body, resetToken) => {
  const { password, passwordConfirm } = body;

  if (password !== passwordConfirm) {
    throw new AppError('Password and Confirm Password do not match.', 400);
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    'local.passwordResetToken': hashedToken,
    'local.passwordResetExpires': { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(
      'The user for this token does not exist or this token has expired',
      400
    );
  }

  user.local.password = password;
  user.local.passwordConfirm = passwordConfirm;
  user.local.passwordResetToken = undefined;
  user.local.passwordResetExpires = undefined;
  await user.save();

  return user;
};

const updatePassword = async (body) => {
  const { id, password, passwordCurrent, passwordConfirm } = body;
  const user = await User.findById(id).select('+local.password');
  if (
    !user ||
    !(await user.correctPassword(passwordCurrent, user.local.password))
  ) {
    return next(new AppError('Passwords are not correct', 403));
  }
  user.local.password = password;
  user.local.passwordConfirm = passwordConfirm;

  return user.save();
};

const sendAccountActivationEmail = async (user, activationToken, protocol) => {
  const activateAccountUrl = `${protocol}://${process.env.CLIENTURL}/activateAccount/${activationToken}`;

  const message = `<p>
    Thanks for registering, please activate your account to get started. Token
    <a
      href="${activateAccountUrl}"
      target="_blank"
    >Reset Password</a>
  </p>`;

  let emailAccount;
  if (user.method === 'local') {
    emailAccount = user.local.email;
  } else {
    emailAccount = user.google.email;
  }

  try {
    await sendMail({
      email: emailAccount,
      subject: 'Activate Account',
      message,
    });

    return;
  } catch (err) {
    /*         user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined; */

    throw new AppError(
      'There was an error trying to send the email to activate account!',
      500
    );
  }
};

const sendForgotPwdEmail = async (user, activationToken, protocol) => {
  const resetUrl = `${protocol}://${process.env.CLIENTURL}/resetPassword/${activationToken}`;

  const message = `<p>
      Forgot your password? Token
      <a
        href="${resetUrl}"
        target="_blank"
      >Reset Password</a>
    </p>`;

  let emailAccount;
  if (user.method === 'local') {
    emailAccount = user.local.email;
  } else {
    emailAccount = user.google.email;
  }

  try {
    await sendMail({
      email: emailAccount,
      subject: 'Reset password',
      message,
    });

    return;
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    throw new AppError(
      'There was an error trying to send the email for password reset!',
      500
    );
  }
};

module.exports = {
  signup,
  localLogin,
  generateTokens,
  logout,
  sendAccountActivationEmail,
  googleSignUp,
  googleSignIn,
  activateAccount,
  refreshToken,
  sendForgotPwdEmail,
  createPwdResetToken,
  resetPassword,
  updatePassword,
};
