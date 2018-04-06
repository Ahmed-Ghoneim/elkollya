const mongoose = require('mongoose');

function unsignedInteger (number) {
  return Math.round(number);
}

var subjectSchema = new mongoose.Schema({

  name: { type: String, required: '{PATH} is required!' },

  code: { type: String, required: '{PATH} is required!', unique: true},

  objective: { type: String },

  academicYear: { type: Number, min: 1, max: 5, validate: unsignedInteger },

  semester: { type: Number, min: 1, max: 2, validate: unsignedInteger },

  minMark: { type: Number, validate: unsignedInteger },

  maxMark: { type: Number, validate: unsignedInteger },

  color: { type: String, unique: true },

  // refrences the related professor ._id from users collection.
  taughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

  // references the department ._id from department collection.
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department'}
});

module.exports = mongoose.model('subject', subjectSchema);
