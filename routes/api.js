const bcrypt = require('bcryptjs');
const User = require('../models/user');
const api = require('express').Router();
const Token = require('../config/Token');


api.post('/register', function(req, res){
  if(req.body.user.isAdmin == false && !req.body.user.department) return res.status(400).json({success: false, msg: 'Student must be assigned to a department'})
  // if no password was provided
  if(!req.body.user.password) return res.status(400).json({success: false, msg: 'no password provided'});

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.user.password, salt, function(err, hash){
      if(err) return res.status(500).json({success: false, msg: 'server-side error'});
      req.body.user.password = hash;

      User.create(req.body.user, function(err, user){
        if(err || !user) {
          return res.status(400).json({success: false, msg: 'not registered, ' + err});
        }else{
          return res.status(200).json({success: true, msg: 'User registered', user: {
            id: user._id,
            username: user.username,
            visibleName: user.visibleName,
            email: user.email
          }});
        }
      });
    });
  });
});

api.post('/login', function(req, res) {
  // Search for the user with email.
  User.findOne({email: req.body.user.email}, function(err, user){
    // if the email is not exist.
    if(!user) return res.status(400).json({success: false, msg: 'incorrect email'});
    // Check if the password is correct or not.
    bcrypt.compare(req.body.user.password, user.password, function(err, isMatch){
      if(err) return res.status(500).json({success: false, msg: 'Server error'});
      if(isMatch){
        var token = Token.sign({id: user._id, isAdmin: user.isAdmin, academicYear: user.academicYear, department: user.department});
        user.populate({path: 'subjects'}, function(err, userSubjects){
          if (err) return res.status(500).json({success: false, msg: 'population, ' + err});
          return res.status(200).json({success: true, msg: 'User Logged', userId: user._id, token: token, subjects: userSubjects.subjects });
        });
      }else return res.status(401).json({success: false, msg: 'incorrect password'});
    });
  });
});

api.get('/', (req, res) => {
  res.json({ date: new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })});
});

// setting the routes.
api.use('/users', Token.verify, require('./users'));
api.use('/answers', Token.verify, require('./answers'));
api.use('/subjects', Token.verify, require('./subjects'));
api.use('/projects', Token.verify, require('./projects'));
api.use('/questions', Token.verify, require('./questions'));
api.use('/departments', Token.verify, require('./departments'));

module.exports = api;
