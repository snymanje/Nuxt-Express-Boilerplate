const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {

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

    req.user = newUser;
    return next();
}