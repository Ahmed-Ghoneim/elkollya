const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const api = require('../routes/api');
const dbConfig = require('./dbConfig');
const User = require('../models/user');
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
  let newUser = new User({
    username: req.body.fullName,
    password: req.body.password,
    email: req.body.email,
    academicNumber: req.body.academicNumber,
    visiableName: req.body.visiableName
  });

  newUser.save(function(err, user){
    if(err || !user) {
      console.log(err);
      return res.status(500).json({success: false, msg: 'not register, ' + err});
    }else{
      res.status(200).json({success: true, msg: 'User registered'});
    }
  });
});

app.post('/login', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user){
    if(!user) return res.status(404).json({success: false, msg: 'incorrect email'});
    if(user.password !== req.body.password) return res.status(401).json({success: false, msg: 'incorrect email'});
    var token = Token.sign({id: user._id});
    res.status(200).json({success: true, msg: 'User registered', auth: true, userid: user._id, token: token });
  });
});

module.exports = app;
