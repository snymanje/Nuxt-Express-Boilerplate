const express = require('express');
require('dotenv').config({
  path: `${__dirname}/.env`,
});

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // Parameter pollution
require('express-async-errors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRoutes = require('./router/authRoutes');
const userRoutes = require('./router/userRoutes');
const profileRoutes = require('./router/profileRoutes');

// connect to mongodb
mongoose
  .connect(process.env.DBCONNECTIONSTRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to mongodb');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to mongodb', error);
  });

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port 5000');
});
