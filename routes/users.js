const users = require('express').Router();
// Loading models.
const User = require('../models/user');
const Question = require('../models/question');


// read TOP TEN students by reputation.
users.get('/', function(req, res){
  User.find({}, ['username visibleName email reputation profilePhoto coverPhoto'],
    {limit: 10, sort: {reputation: -1}}, function(err, users){
      if(err) return res.status(400).json({success: false, msg: 'something went wrong, ' + err});
      return res.status(200).json({success: true, users});
    });
});


// read all questions that related to the user department in his academic year.
users.get('/feed', function(req, res) {

  var skipped = parseInt(req.query.skip);
  var limitted = 10;

  User.findById(req.userId, function(err, userSubjects){

    let queryOptions;
    if (req.isAdmin)  queryOptions = {department: req.department, subject: {$in: userSubjects.subjects}};
    else queryOptions = {subject: {$in: userSubjects.subjects}, academicYear: req.academicYear, department: req.department};
    Question.find(queryOptions).
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

// admins add subject to specific user.
users.post('/:userId/subjects/:subjectId', function(req, res){
  if(!req.isAdmin)  return res.status(403).json({success: false, msg: 'Only professors allowed to add subject to the users'});

  User.findByIdAndUpdate(req.params.userId, { $addToSet: {"subjects": req.params.subjectId} }, function(err, user){
    if(err) return res.status(400).json({success: false, msg: 'something went wrong, ' + err});
    if(!user) return res.status(404).json({success: false, msg: 'User not found'});
    return res.status(200).json({success: true, subjects: user.subjects});
  });
});

module.exports = users;
