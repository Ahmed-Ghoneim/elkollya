const mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({

  body: { type: String, required: '{PATH} is required!' },

  date: { type: Date, default: Date.now },

  // array of tags that included in this answer.
  tags: [String],

  // references the related question ._id from questions collection.
  questionId: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', ref: 'question' },

  // references the user ._id who answered this, from users collection.
  answeredBy: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', ref: 'user' },

  /* multivalued attributes hold the ._id s from users collection. */
  upvotedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}],

  downVotedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model('answer', answerSchema);
