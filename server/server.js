const express = require('express');
require('dotenv').config();

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

const userRoutes = require('./router/userRoutes');
const profileRoutes = require('./router/profileRoutes');

// connect to mongodb
mongoose
  .connect(
    'mongodb://auth:auth123@jeanscluster-shard-00-00-wwzcb.mongodb.net:27017,jeanscluster-shard-00-01-wwzcb.mongodb.net:27017,jeanscluster-shard-00-02-wwzcb.mongodb.net:27017/authtutorial?ssl=true&replicaSet=JeansCluster-shard-0&authSource=admin&retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
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
    origin: 'http://localhost:8080',
    credentials: true,
  })
);
app.use('/auth', rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', userRoutes);
app.use('/profile', profileRoutes);

// Catch all routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 500));
});

app.use(globalErrorHandler);

app.listen(5000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 5000');
});
