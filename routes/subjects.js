const subjects = require('express').Router();
// load models.
const User = require('../models/user');
const Subject = require('../models/subject');


// read all subjects from database.
subjects.get('/', function(req, res){

  Subject.find({}, function(err, subjects){
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    return res.status(200).json({success: true, subjects});
  });
});


// read a subject by its id.
subjects.get('/:id', function(req, res){

  Subject.findById(req.params.id, function(err, subject){
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!subject) return res.status(404).json({success: false, msg: 'subject not found'});
    res.status(200).json({success: true, subject});
  });
});


// create a subject.
subjects.post('/', function(req, res){
  if(req.isAdmin)
    Subject.create(req.body.subject, function(err, subject){
      if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
      return res.status(200).json({success: true, subject});
    });
  else return res.status(401).json({success: false, msg: 'You are not allowed to create a subject'});
});
module.exports = subjects;
