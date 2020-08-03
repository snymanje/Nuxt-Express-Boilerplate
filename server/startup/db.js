const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = async () => {
  await mongoose.connect(process.env.DBCONNECTIONSTRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('Connected to mongodb');
  logger.info('Successfully connected to MongoDB');
};
