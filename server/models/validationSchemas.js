const Joi = require('joi');

const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(35).required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(6).max(25).required().strict(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().strict(),
});

const localAuthSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(6).max(25).required().strict(),
});

const passwordResetSchema = Joi.object({
  password: Joi.string().min(6).max(25).required().strict(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().strict(),
});

const passwordUpdateSchema = Joi.object({
  id: Joi.string().required(),
  passwordCurrent: Joi.string().min(6).max(25).required().strict(),
  password: Joi.string().min(6).max(25).required().strict(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().strict(),
});

const googleTokenSchema = Joi.object({
  access_token: Joi.string().required(),
});

const logoutSchema = Joi.object({
  _id: Joi.string().required(),
});

module.exports = {
  localAuthSchema,
  logoutSchema,
  signUpSchema,
  googleTokenSchema,
  passwordResetSchema,
  passwordUpdateSchema,
};
