const AppError = require('../utils/appError');
const Joi = require('joi');

exports.validateSignIn = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return next(
      new AppError('Please enter a valid username and password', 400)
    );
  }
  return next();
};

exports.validateSignUp = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return next(
      new AppError('Please enter a valid username and password', 400)
    );
  }
  return next();
};
