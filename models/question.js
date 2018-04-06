const mongoose = require('mongoose');

function unsignedInteger (number) {
  return Math.round(number);
}

var questionSchema = new mongoose.Schema({

  question: { type: String, required: '{PATH} is required!' },

  date: { type: Date, default: Date.now },

  academicYear: { type: Number, min: 1, max: 5, validate: unsignedInteger},

  // a property that indicate if the question could
  // be answered anymore or not.
  isOpend: { type: Boolean, default: true },

  // array that contains all the tags included in this question.
  tags: [String],

  // references the subject ._id that the question is related to from subjects collection.
  subjectId: [{type:mongoose.Schema.Types.ObjectId, ref: 'subject'}],

  // references the user ._id who asked the question from users collection.
  askedBy: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', ref: 'user' },

  // references the answers ._id s related to
  //that question from answers collection.
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'answer'}],

  // references all users ._id who up voted
  // that question from users collection.
  upVotedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],

  // references all users ._id who down voted
  // that question from users collection.
  downVotedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model('question', questionSchema);
