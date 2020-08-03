require('express-async-errors');
const logger = require('../utils/logger');

process.on('uncaughtException', (ex) => {
  console.log(ex.message);
  logger.error(ex.message, ex);
  process.exit(1);
});
process.on('unhandledRejection', (ex) => {
  console.log(ex.message);
  logger.error(ex.message, ex);
  process.exit(1);
});
