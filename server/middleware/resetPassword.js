const crypto = require('crypto');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    const {password, passwordConfirm} = req.body;
    if (password !== passwordConfirm) {
        return next(new AppError('Password and Confirm Password do not match.', 400));
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        'local.passwordResetToken': hashedToken,
        'local.passwordResetExpires': { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new AppError(
                'The user for this token does not exist or this token has expired',
                400
            )
        );
    }

    user.local.password = password;
    user.local.passwordConfirm = passwordConfirm;
    user.local.passwordResetToken = undefined;
    user.local.passwordResetExpires = undefined;
    await user.save();

    req.user = user;
    return next();
}