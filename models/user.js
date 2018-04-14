const mongoose = require('mongoose');

function unsignedInteger (number) {
  return Math.round(number);
}

const userSchema = new mongoose.Schema({

  academicNumber: { type: Number, min: 1, unique: true, required: '{PATH} is required!',  validate: unsignedInteger},

  visibleName: { type: String, required: '{PATH} is required!' },

  username: { type: String, unique: true, required: '{PATH} is required!' },

  email: { type: String, lowercase: true, unique: true, required: '{PATH} is required!', match: [/^[a-z]+[\.]{0,1}[a-z]+[\d]*@el-eng\.menofia\.edu\.eg$/, 'Please fill a valid email address'] },

  password: { type: String, required: '{PATH} is required!'},

  profilePhoto: {type: String, default: 'https://i.imgur.com/wYvXj8g.jpg' },

  coverPhoto: {type: String, default: 'https://i.imgur.com/wYvXj8g.jpg' },

  about: String,

  birthday: Date,

  gender: String,

  // a property that shows if this user is a staff member or not,
  // true means that he/she is a staff memmber
  isAdmin: { type: Boolean, default: false },

  reputation: { type: Number, default: 0 },

  academicYear: { type: Number, min: 1, Max: 5, validate: unsignedInteger },

  section: { type: Number, min: 1, validate: unsignedInteger },

  // a property that shows if the user can ask/answer any question,
  // will be be used if the the user misbehaved.
  isAllowedToPost: { type: Boolean, default: true },

  phone: {type: String},

  address: { type: String },

  ssid: { type: Number, validate: unsignedInteger },

  // references the department ._id from department collection.
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },

  // references the registered subjects ._id s from subjects collection.
  subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'subject' }],

  // references the questions ._id s that the user has asked from questions collection.
  questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],

  // references the answers ._id s that the user has answered from answers collection.
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'answer'}],

  // references the projects ._id s that the user has participated in from projects collectios.
  projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'project'}],

  // references the quizzes ._id s that the user had been assigned to from quiz collection.
  quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'quiz'}],

  // references the notificatios ._id s that the user has received from notifications collection.
  notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'notification'}]

});

module.exports = mongoose.model('user', userSchema);
