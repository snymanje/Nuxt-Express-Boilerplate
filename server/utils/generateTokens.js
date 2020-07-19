const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const { _id } = user;
  return jwt.sign({ _id }, process.env.TOKENSECRET, {
    expiresIn: process.env.TOKENEXPIRES,
  });
};

exports.generateRefreshToken = (user) => {
  const { _id } = user;
  return jwt.sign({ _id }, process.env.REFRESHTOKENSECRET, {
    expiresIn: process.env.REFRESHTOKENEXPIRES,
  });
};
