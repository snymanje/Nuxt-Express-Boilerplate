const Joi = require('joi');

const authenticateSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  authenticateSchema,
};
