const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const { OAuth2Client } = require('google-auth-library');

module.exports = async (req, res, next) => {
    const { access_token } = req.body;

    if (!access_token)
        return next(new AppError('The google access token was not provided.', 400));

    const CLIENT_ID = process.env.GOOGLECLIENTID;
    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: access_token,
        audience: CLIENT_ID,
    });

    const { sub, name, email, picture } = ticket.getPayload();

    // check if the current user exists in the DB
    const existingUser = await User.findOne({ 'google.id': sub });

    if(existingUser && !existingUser.active)
        return next(new AppError('You already have an account that is not activated yet', 403));

    if (existingUser && existingUser.active) {
        return next(new AppError('You already already signed up, go to login', 403));
    }

    // Id user does not exist creat a new one`);
    const newUser = await User.create({
        method: 'google',
        google: {
            id: sub,
            name: name,
            photo: picture,
            email: email
        }
    });

    const accountActivationToken = newUser.createAccountActivationToken();
    await newUser.save({ validateBeforeSave: false });

    req.accountActivationToken = accountActivationToken;
    req.user = newUser;
    return next();
};
