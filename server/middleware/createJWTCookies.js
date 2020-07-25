const {
    generateToken,
    generateRefreshToken,
} = require('../utils/generateTokens');

module.exports = async (req, res, next) => {
    const { user } = req;
    const token = generateToken(user);
    const refreshtoken = generateRefreshToken(user);

    const refreshtokenArray = refreshtoken.split('.');
    const [refreshTokenHeader, refreshTokenPayload, refreshTokenSignature] = refreshtokenArray;

    res.cookie('token', token, {
        httpOnly: true,
        //maxAge: process.env.COOKIEEXPIRES,
    });
    res.cookie('refreshTokenSignature', refreshTokenSignature, {
        httpOnly: true,
        //maxAge: process.env.REFRESHCOOKIEEXPIRES,
    });
    res.cookie('refreshTokenPayload', `${refreshTokenHeader}.${refreshTokenPayload}`, {
        maxAge: process.env.REFRESHCOOKIEEXPIRES,
    });

    return next();
}