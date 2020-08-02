const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // Parameter pollution
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const profileRoutes = require('../router/profileRoutes');
const userRoutes = require('../router/userRoutes');
const authRoutes = require('../router/authRoutes');

module.exports = (app) => {
  const rateLimiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, try again later',
  });
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(helmet());
  app.use(
    hpp({
      whitelist: [],
    })
  );
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use('/auth', rateLimiter);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/profile', profileRoutes);

  // Catch all routes
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 500));
  });

  app.use(globalErrorHandler);
};
