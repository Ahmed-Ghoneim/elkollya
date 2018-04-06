const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({

  title: { type: String , required: '{PATH} is required!' },

  description: { type: String },

  startDate: Date,

  deadline: Date,

  // refrences the subject ._id from subjects collection
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'subject' },

  // refrences the instructor ._id from users collection
  supervisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

  // references the project creator ._id from users collection.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: '{PATH} is required!' },

  /* multivalued attributes */

  // refrences the project members ._id from users collection
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],

  // refrences the disscusion questions ._id from the questions collection
  questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}]
});

module.exports = mongoose.model('project', projectSchema);
