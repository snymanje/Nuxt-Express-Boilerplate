const {
    generateToken,
    generateRefreshToken,
} = require('./generateTokens');

exports.setAuthCookies = (res, user) => {
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

    return res;
}

exports.clearAuthCookies = (res) => {
    res.cookie('token', false, {
        httpOnly: true,
        maxAge: 0,
    });
    res.cookie('refreshTokenSignature', false, {
        httpOnly: true,
        maxAge: 0,
    });
    res.cookie('refreshTokenPayload', false, {
        maxAge: 0,
    });

    return res;
}