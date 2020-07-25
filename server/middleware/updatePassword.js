const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    const { id, password, passwordCurrent, passwordConfirm  } = req.body;
    const user = await User.findById(id).select('+local.password');
    if (!user ||
        !(await user.correctPassword(passwordCurrent, user.local.password))
    ) {
        return next(new AppError('Passwords are not correct', 403));
    }
    user.local.password = password;
    user.local.passwordConfirm = passwordConfirm;

    await user.save();
    return next();
}

