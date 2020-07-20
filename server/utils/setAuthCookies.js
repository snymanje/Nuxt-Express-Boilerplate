const {
    generateToken,
    generateRefreshToken,
} = require('../utils/generateTokens');

exports.setAuthCookies = (res, user) => {
    const token = generateToken(user);
    const refreshtoken = generateRefreshToken(user);

    const arrayToken = token.split('.');
    const [tokenHeader, tokenPayload, tokenSignature] = arrayToken;

    res.cookie('refreshToken', refreshtoken, {
        httpOnly: true,
    });
    res.cookie('tokenSignature', tokenSignature, {
        httpOnly: true,
    });
    res.cookie('tokenPayload', `${tokenHeader}.${tokenPayload}`, {
        maxAge: process.env.COOKIEEXPIRES,
    });

    return res;
}