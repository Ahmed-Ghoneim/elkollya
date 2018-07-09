const cors = require('cors');
const express = require('express');
const api = require('../routes/api');
const dbConfig = require('./dbConfig');
const bodyParser = require('body-parser');

var app = express();


// CORS middleware to allow requests on api.
app.use(cors());

// Folder to store html & css files
app.use(express.static('./public'));

// Body parser middleware
app.use(bodyParser.json());

// Loading the api version 1.
app.use('/api/v1', api);

// For undefined routes.
app.all('*', function(req, res, next){
  return res.status(404).json({msg: 'Page not found'});
});

module.exports = app;

