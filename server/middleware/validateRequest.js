const AppError = require('../utils/appError');

exports.validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      return next(
        new AppError(
          `Validation error: ${error.details.map((x) => x.message).join(', ')}`,
          400
        )
      );
    } else {
      req.body = value;
      next();
    }
  };
};
