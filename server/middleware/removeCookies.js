module.exports = async (req, res, next) => {
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

    return next();
}