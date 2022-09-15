const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/node-login-v2-DB';

/**
 * This function connects the application to the MongoDB database server.
 */
const dbConnect = () => {
  mongoose.connect(MONGODB_URI, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log('Connected to MongoDB database server');
  });
};

module.exports = dbConnect;
