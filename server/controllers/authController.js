/* eslint-disable prettier/prettier */
const sendMail = require('../utils/email');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const authService = require('../services/authService');

const setTokenCookies = (res, tokens) => {
    const refreshtokenArray = tokens.refresh_token.split('.');
    const [refreshTokenHeader, refreshTokenPayload, refreshTokenSignature] = refreshtokenArray;

    res.cookie('token', tokens.access_token, {
        httpOnly: true,
        //maxAge: process.env.COOKIEEXPIRES,
    });
    res.cookie('refreshTokenSignature', refreshTokenSignature, {
        httpOnly: true,
        //maxAge: process.env.REFRESHCOOKIEEXPIRES,
    });
    res.cookie('refreshTokenPayload', `${refreshTokenHeader}.${refreshTokenPayload}`, {
        maxAge: process.env.REFRESHCOOKIEEXPIRES,
    });
}

exports.googleSignup = async (req, res, next) => {
    const { accountActivationToken, user } = req;
    const activateAccountUrl = `${req.protocol}://${process.env.CLIENTURL}/activateAccount/${accountActivationToken}`;

    const message = `<p>
    Thanks for registering, please activate your account to get started. Token
    <a
      href="${activateAccountUrl}"
      target="_blank"
    >Reset Password</a>
  </p>`;

    try {
        await sendMail({
            email: user.google.email,
            subject: 'Activate Account',
            message,
        });

        res.status(201).json({
            status: true,
            message: 'Email sent for account activation',
        });
    }
    catch (err) {
        /*         user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined; */

        return next(new AppError('There was an error trying to send the email to activate account!', 500));
    }
}

exports.googleLogin = async (req, res, next) => {
    res.status(200).json({
        status: true,
        message: 'Account activated successfully.'
    });
}

exports.signup = async (req, res, next) => {

    const user = await authService.signup(req.body);

    const activateAccountUrl = `${req.protocol}://${process.env.CLIENTURL}/activateAccount/${user.accountActivationToken}`;

    const message = `<p>
    Thanks for registering, please activate your account to get started. Token
    <a
      href="${activateAccountUrl}"
      target="_blank"
    >Reset Password</a>
  </p>`;

    try {
        await sendMail({
            email: user.local.email,
            subject: 'Activate Account',
            message,
        });

        res.status(201).json({
            status: true,
            message: 'Email sent for account activation',
        });
    }
    catch (err) {
        /*         user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined; */

        return next(new AppError('There was an error trying to send the email to activate account!', 500));
    }
};

exports.login = async (req, res, next) => {
    const user = await authService.localLogin(req.body);
    const tokens = await authService.generateTokens(user)
    setTokenCookies(res, tokens);

    res.status(200).json({
        status: true,
        message: "You logged into your profile successfully!",
        data: user
    });
};

exports.logout = async (req, res, next) => {
    const { _id } = req.body;
    if (!_id)
        return next(new AppError('No user id provided', 400));

    const user = await User.findOne({ _id });

    if (!user)
        return next(new AppError('User not found', 400));

    res.status(200).json({
        status: true,
        message: "You logged out successfully!"
    });
};

exports.activateAccount = async (req, res, next) => {
    const { user } = req;
    res.status(200).json({
        status: true,
        message: "You logged into your profile successfully!",
        data: user
    });
};

exports.tokenRefresh = async (req, res, next) => {
    res.status(200).json({
        status: true,
        message: 'Token refreshed successfully.'
    });
};

exports.forgotPassword = async (req, res, next) => {
    const { user, resetToken } = req;

    const resetUrl = `${req.protocol}://${process.env.CLIENTURL}/resetPassword/${resetToken}`;

    const message = `<p>
      Forgot your password? Token
      <a
        href="${resetUrl}"
        target="_blank"
      >Reset Password</a>
    </p>`;

    try {
        await sendMail({
            email: user.local.email,
            subject: 'Reset password',
            message,
        });

        res.status(200).json({
            status: true,
            message: 'Token send to email',
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        return next(new AppError('There was an error trying to send the email for password reset!', 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    res.status(200).json({
        status: true,
        message: "Password reset successfully!"
    });
};

exports.updatePassword = async (req, res, next) => {
    res.status(200).json({
        status: true,
        message: 'Password updated successfully!',
    });
};