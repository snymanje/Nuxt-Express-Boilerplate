require("dotenv").config();
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.tokenSignature && req.cookies.tokenPayload) {
    token = `${req.cookies.tokenPayload}.${req.cookies.tokenSignature}`;
  }
  if (!token) {
    res.status(400).send("You are not logged in");
  }
  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.TOKENSECRET);

  next();
};
