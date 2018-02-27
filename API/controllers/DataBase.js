const mongoose = require('mongoose');
const DATABASE_URI='mongodb://RyanStark24:' + encodeURIComponent(process.env.MONGO_ATLAS_PW) +
  '@timetablegenerator-shard-00-00-govcj.mongodb.net:27017,timetablegenerator-shard-00-01-govcj.mongodb.net:27017,' +
  'timetablegenerator-shard-00-02-govcj.mongodb.net:27017/test?ssl=true&replicaSet=TimeTableGenerator-shard-0&authSource=admin';

// Creating DataBase connection
  mongoose.connect(DATABASE_URI)
  .catch(err => { // mongoose connection error will be handled here
    console.error('App starting error:', err.stack);
    process.exit(1);
  });
  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');
  });

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
