/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
        user
    });
}

exports.signup = async (req, res, next) => {

    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Password and Confirm Password do not match.', 400));
    }
    const newUser = await User.create({
        method: 'local',
        'local.name': req.body.name,
        'local.email': req.body.email,
        role: req.body.role,
        'local.password': req.body.password,
        'local.passwordConfirm': req.body.passwordConfirm,
    });

    // Create token with user id as the payload
    setAuthCookies(res, newUser);

    res.status(201).json({
        status: true,
        data: {
            user: {
                name,
                email,
                _id,
            },
        },
    });
};

exports.tokenRefresh = async (req, res, next) => {
    // check for a token
    let refreshToken;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        // eslint-disable-next-line prefer-destructuring
        refreshToken = authorization.split(' ')[1];
    } else if (req.cookies.refreshTokenSignature && req.cookies.refreshTokenPayload) {
        refreshToken = `${req.cookies.refreshTokenPayload}.${req.cookies.refreshTokenSignature}`;
    }

    if (!refreshToken) {
        return next(new AppError('No refresh token found', 401));
    }

    // verify the token
    const decoded = await promisify(jwt.verify)(
        refreshToken,
        process.env.REFRESHTOKENSECRET
    );
        console.log(decoded)
    // Check if user exists
    const loggedInUser = await User.findById(decoded._id);
    if (!loggedInUser) {
        return next(
            new AppError('User for this token nolonger exists, please register', 401)
        );
    }

    if (loggedInUser.method === 'local') {
        // Check if the user changed his password.
        if (loggedInUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password has changed, please log in again', 401));
        }
    }

    // create new tokens
    setAuthCookies(res, loggedInUser);

    // return tokens
    res.status(200).json({
        status: true
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new AppError('Please enter a username and password', 400));

    const user = await User.findOne({ 'local.email': email }).select('+local.password');

    if (!user || !(await user.correctPassword(password, user.local.password)))
        return next(new AppError('Incorrect username or password', 401));

    setAuthCookies(res, user);

    res.status(200).json({
        status: true,
        message: "Loggin successful!"
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
        message: "Logout successful!"
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