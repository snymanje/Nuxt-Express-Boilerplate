const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = () => {
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(
    new winston.transports.MongoDB({
      db: process.env.DBCONNECTIONSTRING,
      level: 'error',
    })
  );
};
