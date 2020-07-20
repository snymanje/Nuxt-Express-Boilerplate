/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const sendMail = require('../utils/email');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const {
    generateToken,
    generateRefreshToken,
} = require('../utils/generateTokens');
const { setAuthCookies, clearAuthCookies } = require('../utils/setCookies')

exports.googleLogin = async (req, res, next) => {
    const { user } = req.user;
    setAuthCookies(res, req.user);
    res.status(200).json({
        status: true,
        message: 'You logged into your Google profile successfully.',
        data: user
    });
}

exports.signup = async (req, res, next) => {
    const user = req.user;
    // Create token with user id as the payload
    setAuthCookies(res, user);

    res.status(201).json({
        status: true,
        message: 'Your signed up successfully.',
        data: user
    });
};

exports.tokenRefresh = async (req, res, next) => {
    const user = req.user;

    setAuthCookies(res, loggedInUser);
    res.status(200).json({
        status: true,
        message: 'Token refreshed successfully.'
    });
};

exports.login = async (req, res, next) => {
    const user = req.user;

    setAuthCookies(res, user);
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

    clearAuthCookies(res);

    res.status(200).json({
        status: true,
        message: "You logged out successfully!"
    });
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('A user with this email address does not exist', 401)
        );
    }

    const resetToken = user.createPasswordResettoken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/auth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Token ${resetUrl}`;

    try {
        await sendMail({
            email: user.email,
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

        return next(new AppError('Internal Server error', 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new AppError(
                'The user for this token does not exist or this token has expired',
                400
            )
        );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
        status: true,
        token,
    });
};

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user ||
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Passwords are not correct', 403));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
        status: true,
        token,
    });
};