/*
  This is a resuable file that can be included in any application,
  used to create, monitor, and close database connection.
*/

const mongoose = require('mongoose');
const keys = require('./keys');

// set database
mongoose.connect(keys.database);

// set Promise as mongooses' promise is deprecated.
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', ()=> {
  console.log('Connected to database: ' + keys.database);
});

mongoose.connection.on('error',function (err) {
  console.log('Database connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Database disconnected');
});

// method to close the connection.
var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function(){
    console.log('Database disconnected through: ' + msg);
    callback();
  });
};

// for nodemon restart.
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});

// for app termination.
process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});

// for Heroku app termination.
process.on('SIGTERM', function(){
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});
