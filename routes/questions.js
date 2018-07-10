const questions = require('express').Router();

const Question = require('../models/question');
const User = require('../models/user');


// create a question and store it to database.
questions.post('/', function(req, res){
  let createQuestion = { body: req.body.question.body,
    subject: req.body.question.subject,
    department: req.department,
    academicYear: req.academicYear,
    askedBy: req.userId
  };
  // store the question to database.
  Question.create(createQuestion, function(err, question){
    if(err) return res.status(400).json({success: false, msg: 'could not store that question, ' + err});
    return res.status(200).json({success: true, msg: 'question stored successfuly', question: {
      _id: question._id,
      body: question.body,
      subject: question.subject,
      date: question.date
    }});
  });
});


// read a question from database with it's id.
questions.get('/:questionId', function(req, res){
  Question.findById(req.params.questionId).populate({path: 'askedBy', select: ['profilePhoto', 'visibleName']}).
  exec(function(err, question){
    if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    if(!question) return res.status(404).json({success: false, msg: 'question not found'});
    let questionIsLiked = question.toObject();
    questionIsLiked.isLiked = (questionIsLiked.upVotedBy.toString().includes(req.userId)) ? true : false;
    res.status(200).json({success: true, question: questionIsLiked});
  });
});


// delete a question from database with it's id.
questions.delete('/:questionId', function(req, res){
  Question.findById(req.params.questionId, {askedBy: 1}, function(err, question){
    if (err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    else if(req.userId !== question.askedBy ) return res.status(403).json({success: false, msg: 'You are not allowed to delete this question'});
    else {
      Question.findByIdAndRemove(question._id, function(err, deletedQuestion){
        return res.status(200).json({success: true, msg: 'question deleted successfully'});
      });
    }
  });
});


// read all answers that related to specific question with its id.
questions.get('/:questionId/answers', function(req, res){

  // find the specific question.
  Question.findById(req.params.questionId, function(err, question){
    if(err) return res.status(400).json({success: false, msg: 'server error, ' + err});
    if(!question)  return res.status(404).json({success: false, msg: 'question not found'});

    // populate answers of that question and answeredBy field from answers.
    question.populate({path: 'answers',
    populate: {path: answeredBy, select: ['profilePhoto', 'visibleName']}}, function(err, questionAnswers){
      if(err) return res.status(500).json({success: false, msg: 'server error, ' + err});

      // Check if the user likes an answer or not.
      let answers = questionAnswers.answers;
      for (var i = 0; i < answers.length; i++) {
        let answer = answers[i].toObject();
        answer.isLiked = (answer.upVotedBy.toString().includes(req.userId)) ? true : false;
        answers[i] = answer;
      }
      return res.status(200).json({success: true, answers});
    });
  });
});


// upvote a question with its id.
questions.post('/:questionId/upvote', function(req, res){
  // add the upvote.
  Question.findByIdAndUpdate(req.params.questionId, {$addToSet: {upVotedBy: req.userId}}, {new: true}, function(err, question){
    if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
    if(!question) return res.status(404).json({success: false, msg: 'Question not found'});
    User.findByIdAndUpdate(question.askedBy, {$inc:{reputation: .3}}, function(err, user){
      if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
      else return res.status(200).json({success: true, msg: 'upvoted successfully', totalUpvotes: question.upVotedBy.length});
    });
  });
});


// remove upvote for a question with its id.
questions.delete('/:questionId/upvote', function(req, res){
  // find that answer.
  Question.findByIdAndUpdate(req.params.questionId, { $pull: {upVotedBy: req.userId}}, {new: true}, function(err, question){
    if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
    if(!question) return res.status(404).json({success: false, msg: 'Question not found'});
    // remove the upvote.
    User.findByIdAndUpdate(question.askedBy, {$inc:{reputation: -.3}}, function(err, user){
      if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
      else return res.status(200).json({success: true, msg: 'downvoted successfully', totalUpvotes: question.upVotedBy.length});
    });
  });
});



module.exports = questions;
