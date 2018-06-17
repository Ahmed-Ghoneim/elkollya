const mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({

  body: { type: String, required: '{PATH} is required!' },

  date: { type: Date },

  // array of tags that included in this answer.
  tags: [String],

  // references the related question ._id from questions collection.
  question: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', ref: 'question' },

  // references the user ._id who answered this, from users collection.
  answeredBy: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', ref: 'user' },

  /* multivalued attributes hold the ._id s from users collection. */
  upvotedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}],

  downVotedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});


answerSchema.pre('save', function(next){

  // store the answer's id to the question related to that answer.
  require('./question').findByIdAndUpdate(this.qusetionId, { $addToSet:{"answers": this._id} }, function(err, question){
    if(err) return next(err);
    else if(!question) return next(new Error('The question is not found'));
    this.date = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
  });

  next();
});


module.exports = mongoose.model('answer', answerSchema);
