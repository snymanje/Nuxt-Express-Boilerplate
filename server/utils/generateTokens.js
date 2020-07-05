const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const { _id, email } = user;
  return jwt.sign({ _id, email }, process.env.TOKENSECRET, {
    expiresIn: process.env.TOKENEXPIRES,
  });
};

exports.generateRefreshToken = (user) => {
  const { _id, email } = user;
  return jwt.sign({ _id, email }, process.env.REFRESHTOKENSECRET, {
    expiresIn: process.env.REFRESHTOKENSECRET,
  });
};
