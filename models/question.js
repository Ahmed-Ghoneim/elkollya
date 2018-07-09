const mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

  body: { type: String, required: '{PATH} is required!' },

  date: { type: Date },

  academicYear: { type: Number, match: /^[1-5]$/, required: true},

  // a property that indicate if the question could
  // be answered anymore or not.
  isOpend: { type: Boolean, default: true },

  // array that contains all the tags included in this question.
  tags: [String],

  // references the department ._id from departments collection.
  department: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'department' },

  // references the subject ._id that the question is related to from subjects collection.
  subject: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'subject'},

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

questionSchema.pre('save', function(next){
  require('./user').findById(this.askedBy, 'academicYear department isAllowedToPost', function(err, user){
    if(err) return next(err);
    if(!user.isAllowedToPost) return next(new Error('This user is not allowed to post questions'));
    this.academicYear = user.academicYear;
    this.department = user.department;
    this.date = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
  });
  next();
});

questionSchema.post('remove', function(next){
  require('./answer').remove({_id: {$in: this.answers}}, function(err, answers){
    if(err) return next(err);
  });
  next();
});

module.exports = mongoose.model('question', questionSchema);
