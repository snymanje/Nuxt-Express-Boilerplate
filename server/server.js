const express = require('express');

const app = express();

require('dotenv').config({
  path: `${__dirname}/.env`,
});
const logger = require('./utils/logger');
require('./startup/exceptionHandling');
require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
