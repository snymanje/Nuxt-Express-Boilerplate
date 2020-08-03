const winston = require('winston');
require('winston-mongodb');

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${__dirname}/../logs/debug.log`,
    }),
    new winston.transports.MongoDB({
      db: process.env.DBCONNECTIONSTRING,
      level: 'info',
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
module.exports.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};
