const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({

  academicNumber: { type: Number, match: /^[1-9][0-9]*$/, unique: true, required: '{PATH} is required!' },

  visibleName: { type: String, required: '{PATH} is required!' },

  username: { type: String, unique: true, required: '{PATH} is required!' },

  email: { type: String, lowercase: true, unique: true, required: '{PATH} is required!', match: [/^[a-z]+[\.]{0,1}[a-z]+[\d]*@el-eng\.menofia\.edu\.eg$/, 'Please fill a valid email address'] },

  password: { type: String, required: '{PATH} is required!'},

  profilePhoto: {type: String, default: 'https://i.imgur.com/wYvXj8g.jpg' },

  coverPhoto: {type: String, default: 'https://i.imgur.com/wYvXj8g.jpg' },

  about: String,

  birthday: Date,

  gender: {type: String, enum: ['male', 'female']},

  status: { type: String, enum: ['new', 'residual', '1st chance', '2nd chance', '3rd chance'], default: 'new' },

  // a property that shows if this user is a staff member or not,
  // true means that he/she is a staff memmber
  isAdmin: { type: Boolean, default: false },

  reputation: { type: Number, default: 0 },

  academicYear: { type: Number, match: /^[1-5]$/, default: 1 },

  section: { type: Number, match: /^[1-9][0-9]*$/ , default: 1},

  // a property that shows if the user can ask/answer any question,
  // will be be used if the the user misbehaved.
  isAllowedToPost: { type: Boolean, default: true },

  address: { type: String },

  phone: {type: String},

  // references the department ._id from department collection.
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },

  // references the registered subjects ._id s from subjects collection.
  subjects: [{type: mongoose.Schema.Types.ObjectId, unique: true, ref: 'subject' }],

  // references the projects ._id s that the user has participated in from projects collectios.
  projects: [{type: mongoose.Schema.Types.ObjectId, unique: true, ref: 'project'}],

  // references the quizzes ._id s that the user had been assigned to from quiz collection.
  quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'quiz'}],

  // references the notifications ._id s that the user has received from notifications collection.
  notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'notification'}]

});

userSchema.plugin(AutoIncrement, {inc_field: 'academicNumber'});

module.exports = mongoose.model('user', userSchema);
