const setAuthCookies = (res, tokens) => {
  const refreshtokenArray = tokens.refresh_token.split('.');
  const [
    refreshTokenHeader,
    refreshTokenPayload,
    refreshTokenSignature,
  ] = refreshtokenArray;

  res.cookie('token', tokens.access_token, {
    httpOnly: true,
    //maxAge: process.env.COOKIEEXPIRES,
  });
  res.cookie('refreshTokenSignature', refreshTokenSignature, {
    httpOnly: true,
    //maxAge: process.env.REFRESHCOOKIEEXPIRES,
  });
  res.cookie(
    'refreshTokenPayload',
    `${refreshTokenHeader}.${refreshTokenPayload}`,
    {
      maxAge: process.env.REFRESHCOOKIEEXPIRES,
    }
  );
};

const clearAuthCookies = (res) => {
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
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
