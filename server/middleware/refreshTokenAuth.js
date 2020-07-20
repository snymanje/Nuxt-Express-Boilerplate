const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
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
    // Check if user exists
    const loggedInUser = await User.findById(decoded._id);
    if (!loggedInUser) {
        return next(
            new AppError('User for this token nolonger exists, please register', 401)
        );
    }
    // Only do this check if your is signup with local username and password
    // Check if the user changed his password.
    if (loggedInUser.method === 'local') {
        if (loggedInUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password has changed, please log in again', 401));
        }
    }

    req.user = loggedInUser;
    return next();
}