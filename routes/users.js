const users = require('express').Router();
// Loading models.
const User = require('../models/user');
const Question = require('../models/question');

// read all questions that related to the user department in his academic year.
users.get('/feed', function(req, res) {

  var skipped = parseInt(req.query.skip);
  var limitted = 10;

  User.findById(req.userId, function(err, userSubjects){

    Question.find({subject: {$in: userSubjects.subjects}, academicYear: req.academicYear, department: req.department}).
    populate({path: 'askedBy', select: ['profilePhoto', 'visibleName']}).skip(skipped).limit(limitted).
    exec(function(err, questions){
        if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});
        if(!questions)  return res.status(404).json({success: false, msg: 'content not avilable'});

        for (var i = 0; i < questions.length; i++) {
          let question = questions[i].toObject();
          question.isLiked = (question.upVotedBy.toString().includes(req.userId)) ? true : false;
          questions[i] = question;
        }

        res.status(200).json({success: true, questions});
    });
  });
});


// read information about the user.
users.get('/:id', function(req, res){
  User.findById(req.params.id, {password: 0, notifications: 0, quizzes: 0} ,function(err, user){
    if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    if(!user) return res.status(404).json({success: false, msg: 'user not found'});
    res.status(200).json({success: true, user});
  });
});


// read questions asked by specific user.
users.get('/:id/questions', function(req, res){
  Question.find({askedBy: req.params.id}, function(err, questions){
    if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    if(!questions) return res.status(404).json({success: false, msg: 'qusetions not found'});

    for (var i = 0; i < questions.length; i++) {
      let question = questions[i].toObject();
      question.isLiked = (question.upVotedBy.toString().includes(req.userId)) ? true : false;
      questions[i] = question;
    }
    res.status(200).json({success: true, questions});
  });
});

// read all user's subjects.
users.get('/:userId/subjects', function(req, res){
  User.findById(req.params.userId, 'subjects').populate({path: 'subjects'}).exec(function(err, userSubjects){
    if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    res.status(200).json({success: true, subjects: userSubjects.subjects});
  });
});

//
// users.post('/:id/subjects', function(req, res){
//   User.findByIdAndUpdate(req.params.id, { $addToSet: {"subjects": req.body.userSubject} }, function(err, user){
//     if(err) return res.status(400).json({success: false, msg: err});
//     res.status(200).json({success: true, msg: user.subjects.color});
//   });
// });

module.exports = users;
