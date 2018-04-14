const api = require('express').Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// importing models.
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Subject = require('../models/subject');
const Department = require('../models/department');
const Project = require('../models/project');


// read all questions that related to the user department in his academic year.
api.get('/users/feed', function(req, res) {

  var skipped = parseInt(req.query.skip);
  var limitted = 10;

  // find the academic year that the student is enrolled.
  User.findById(req.userId, 'academicYear', function(err, user){
    if(err) return res.status(500).json({success: false, msg: 'server errorU'});
    if(!user) return res.status(404).json({success: false, msg: 'user not found'});

    Question.find({academicYear: user.academicYear}).
    populate({path: 'askedBy', select: ['profilePhoto', 'visiableName']}).skip(skipped).limit(limitted).
    exec(function(err, questions){
        if(err) return res.status(500).json({success: false, msg: 'server errorQ'});
        if(!questions)  return res.status(404).json({success: false, msg: 'content not avilable'});

        for (var i = 0; i < questions.length; i++) {

          var question = questions[i].toObject();
          question.upVotedBy = question.upVotedBy.toString();
          question.isLiked = (question.upVotedBy.includes(req.userId)) ? true : false;
          questions[i] = question;
        }

        res.status(200).json({success: true, questions});

    });

  });

});

// read a question from database with it's id.
api.get('/questions/:id', function(req, res){
  Question.findById(req.params.id,function(err, question) {
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!question) return res.status(404).json({success: false, msg: 'question not found'});
    res.status(200).json({success: true, question});
  });
});

// create a question and store it to database.
api.post('/questions', function(req, res){

  // find the user who asked the question.
  User.findById(req.userId, function(err, user){
    if (err)  return res.status(500).json({success: false, msg: 'server error'});
    if(!user) return res.status(404).json({success: false, msg: 'user not found'});

    // store the question to database.
    Question.create(req.body.question, function(err, question){

      if(err) return res.status(400).json({success: false, msg: 'could not store that question, ' + err.message});

      // store question's id to user's questions.
      user.questions.push(question);
      user.save(function(err, user){
        res.status(200).json({success: true, msg: 'question stored successfuly'});
      });

    });

  });

});

// read answers related to specific question id.
api.get('/questions/:id/answers', function(req, res){
  Question.findById(req.params.id, {question: 1}).populate('answers').exec(function(err, question){
    if (err)  return res.status(500).json({success: false, msg: 'server error'});
    if(!question) return res.status(404).json({success: false, msg: 'question not found'});
    res.status(200).json({success: true, question});
  });
});

// read all answers that related to specific question with it's id.
api.get('/qusetions/:id/answers', function(req, res){
  Answer.find({questionId}, function(err, answers){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!answers)  return res.status(404).json({success: false, msg: 'question not found'});
    res.status(200).json({success: true, answers});
  });
});

// create an answer.
api.post('/answers', function(req, res){

  // store that answer to database.
  Answer.create(req.body.answer, function(err, answer){
    if(err) return res.status(400).json({success: false, msg: 'could not store that answer, ' + err});

    // store answer's id to user's answers.
    User.update({_id: req.userId}, {$addToSet:{"answers": answer._id}}, function(err, user){
      if(err) return res.status(400).json({success: false, msg: err});

      // store the answer's id to the question related to that answer.
      Question.update({_id: answer.qusetionsId}, { $addToSet:{"answers": answer._id}}, function(err, question){
        if(err) return res.status(400).json({success: false, msg: err});
        res.status(200).josn({success: true, msg: 'answer stored successfuly'});
      });
    });
  });
});

// read an answer with it's id.
api.get('/answers/:id', function(req, res){
  Answer.findById(req.params.id, function(err, answer) {
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!question) return res.status(404).json({success: false, msg: 'answer not found'});
    res.status(200).json({success: true, answer});
  });
});

// read questions asked by specific user.
api.get('/users/:id/questions', function(req, res){
  Question.find({askedBy: req.params.id}, function(err, questions){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!questions) return res.status(404).json({success: false, msg: 'qusetions not found'});
    res.status(200).json({success: true, questions});
  });
});

// create a department.
api.post('/departments', function(req, res){
  Department.create(req.body.department, function(err, department){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!department) return res.status(400).json({success: false, msg: err});
    res.status(200).json({success: true, msg: 'department added successfuly'});
  });
});

// read all departments.
api.get('/departments', function(req, res){
  Department.find({}, function(err, departments){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!departments) return res.status(404).json({success: false, msg: 'departments not found'});
    res.status(200).json({success: true, departments});
  });
});

// create a project.
api.post('/projects', function(req, res){

  // create a project.
  Project.create(req.body.project, function(err, project){
    if(err) return res.status(400).json({success: false, msg: err});

    // store the project id to each member participated in that project.
    User.updateMany({_id: {$in: project.members}}, { $addToSet:{"projects": project._id}},function(err, users){
      if(err) return res.status(400).json({success: false, msg: err});
      res.status(200).json({success: true, msg: 'project stored successfully'});
    });

  });

});

api.get('/projects', function(req, res){
  Project.find({}, function(err, projects){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    res.status(200).json({success: true, projects});
  });
});

module.exports = api;
