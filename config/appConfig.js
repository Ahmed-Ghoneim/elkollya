const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const api = require('../routes/api');
const dbConfig = require('./dbConfig');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Token = require('../config/Token');

var app = express();


// CORS middleware to allow requests on api (optional)
app.use(cors());

// Folder to store html & css files
app.use(express.static('./public'));

// Body parser middleware
app.use(bodyParser.json());

app.use('/api', Token.verify, api);

app.post('/register', function(req, res){
console.log(req.body);
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.user.password, salt, function(err, hash){
      if(err) throw err;
      req.body.user.password = hash;

      User.create(req.body.user, function(err, user){
        if(err || !user) {
          return res.status(400).json({success: false, msg: 'not registered'});
        }else{
          return res.status(200).json({success: true, msg: 'User registered'});
        }
      });
    });
  });
});

app.post('/login', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user){
    if(!user) return res.status(400).json({success: false, msg: 'incorrect email'});
    bcrypt.compare(req.body.password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        var token = Token.sign({id: user._id});
        return res.status(200).json({success: true, msg: 'User Logged', userId: user._id, token: token });
      }
      return res.status(401).json({success: false, msg: 'incorrect password'});
    });
  });
});

app.get('*', function(req, res){
  return res.status(404).json({msg: 'Page not found'});
});

module.exports = app;
