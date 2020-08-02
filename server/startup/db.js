const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
  mongoose
    .connect(process.env.DBCONNECTIONSTRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to mongodb');
      winston.info('Successfully connected to MongoDB');
    });
};
