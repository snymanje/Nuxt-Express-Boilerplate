const AppError = require('../../utils/appError');
const User = require('../../models/userModel');

module.exports = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new AppError('Please enter a username and password', 400));

    const user = await User.findOne({ 'local.email': email }).select('+local.password');

    if (!user || !(await user.correctPassword(password, user.local.password)))
        return next(new AppError('Incorrect username or password', 401));

    if(!user.active)
        return next(new AppError('You have not activated your account yet', 403));

    console.log(user)
    req.user = user;
    return next();
}