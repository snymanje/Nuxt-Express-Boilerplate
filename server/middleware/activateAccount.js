const crypto = require('crypto');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    const { activationToken } = req.params
    console.log(activationToken)

    const hashedToken = crypto
        .createHash('sha256')
        .update(activationToken)
        .digest('hex');


    const user = await User.findOne({
        accountActivationToken: hashedToken,
        /* 'local.passwordResetExpires': { $gt: Date.now() }, */
    });

    if (!user) {
        return next(
            new AppError(
                'The user for this token does not exist or this token has expired',
                400
            )
        );
    }

    if (user.active) {
        return next(
            new AppError(
                'This account is already active',
                400
            )
        );
    }

    user.active = true;
    await user.save();

    /* req.user = user; */
    return next();
}