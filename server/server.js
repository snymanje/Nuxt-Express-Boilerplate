const express = require('express');

const app = express();

require('dotenv').config({
  path: `${__dirname}/.env`,
});

process.on('uncaughtException', (ex) => {
  console.log(ex.message);
  winston.error(ex.message, ex);
  process.exit(1);
});
process.on('unhandledRejection', (ex) => {
  console.log(ex.message);
  winston.error(ex.message, ex);
  process.exit(1);
});

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port 5000');
});
