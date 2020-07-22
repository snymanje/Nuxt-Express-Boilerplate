const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    const user = await User.findOne({ 'local.email': req.body.email });
    if (!user) {
        return next(
            new AppError('A user with this email address does not exist', 401)
        );
    }

    const resetToken = user.createPasswordResettoken();
    await user.save({ validateBeforeSave: false });

    req.user = user;
    req.resetToken = resetToken;
    return next();
}