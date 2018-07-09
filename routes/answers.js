const answers = require('express').Router();
// Loading models.
const Answer = require('../models/answer');

// create an answer.
answers.post('/', function(req, res){

  let createAnswer = { answeredBy: req.userId,
    body: req.body.answer.body,
    question: req.body.answer.question
  };

  Answer.create(createAnswer, function(err, answer){
    if(err) return res.status(400).json({success: false, msg: 'something went wrong, ' + err});
    return res.status(200).josn({success: true, msg: 'answer stored successfuly', answer});
  });
});


// read an answer with it's id.
answers.get('/:id', function(req, res){

  Answer.findById(req.params.id).populate({path: answeredBy, select: ['profilePhoto', 'visibleName']}).
  exec(function(err, answer) {
    if(err) return res.status(500).json({success: false, msg: 'something went wrong, ' + err});
    if(!answer) return res.status(404).json({success: false, msg: 'answer not found'});
    // Check if that user liked this answer or not.
    let answerIsLiked = answer.toObject();
    answerIsLiked.isLiked = (answerIsLiked.upVotedBy.toString().includes(req.userId)) ? true : false;
    return res.status(200).json({success: true, answer: answerIsLiked});
  });
});


// delete an answer with it's id.
answers.delete('/:answerId', function(req, res){
  Answer.findById(req.params.answerId, {askedBy: 1}, function(err, answer){
    if (err) return res.status(500).json({success: false, msg: 'server error, ' + err});
    else if(req.userId !== answer.askedBy ) return res.status(403).json({success: false, msg: 'You are not allowed to delete this answer'});
    else {
      Answer.findByIdAndRemove(answer._id, function(err, deletedAnswer){
        return res.status(200).json({success: true, msg: 'answer deleted successfully'});
      });
    }
  });
});


// upvote an answer
answers.post('/:answerId/upvote', function(req, res){
  // find that answer.
  Answer.findByIdAndUpdate(req.params.answerId, { $addToSet: {"upVotedBy": req.userId}}, function(err, answer){
    if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
    if(!answer) return res.status(404).json({success: false, msg: 'Answer not found'});
    User.findByIdAndUpdate(answer.answeredBy, {$inc:{reputation: .3}}, function(err, user){
      if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
      else return res.status(200).json({success: true, msg: 'upvoted successfully', totalUpvotes: answer.upVotedBy.length});
    });
  });
});


// remove upvote for an answer with its id.
answers.delete('/:answerId/upvote', function(req, res){
  // find that answer.
  Answer.findByIdAndUpdate(req.params.answerId, { $removeFromSet: {"upVotedBy": req.userId}}, function(err, answer){
    if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
    if(!answer) return res.status(404).json({success: false, msg: 'Answer not found'});
    User.findByIdAndUpdate(answer.answeredBy, {$inc:{reputation: -.3}}, function(err, user){
      if(err) return res.status(400).json({success: false, msg: 'Something went wrong, ' + err});
      else return res.status(200).json({success: true, msg: 'downvoted successfully', totalUpvotes: answer.upVotedBy.length});
    });
  });
});


module.exports = answers;
