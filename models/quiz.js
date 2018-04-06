const mongoose = require('mongoose');

var quizSchema = new mongoose.Schema({

  title: { type: String, required: '{PATH} is required!'},

  content: { type: String, required: '{PATH} is required!'},

  startDate: {type: Date, default: Date.now },

  deadline: Date,

  // references the subject ._id from subjects collection
  subjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'subject'},

  // references the professor ._id from users collection
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('quiz', quizSchema);
