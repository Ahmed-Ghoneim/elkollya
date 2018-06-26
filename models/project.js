const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({

  title: { type: String, required: '{PATH} is required!' },

  description: { type: String },

  startDate: Date,

  deadline: Date,

  // refrences the subject ._id from subjects collection
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'subject' },

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

projectSchema.pre('save', function(next){

  const User = require('./user');
  // store the project id to each member participated in that project.
  User.updateMany({_id: {$in: this.members}}, { $addToSet:{"projects": project._id}}, function(err, users){
    if(err) return next(err);
    else if(!users) return next(new Error('Members are not exist'));
  });

  // check if supervisedBy isAdmin or not.
  if(this.supervisedBy != null){
    User.findById(this.supervisedBy, 'isAdmin', function(err, user){
      if(err) return next(err);
      else if(!user)  return next(new Error('This supervisor is not registered!'));
      if(!user.isAdmin)  return next(new Error('Supervisor must be an admin'));
    });
  }
  next();
});

module.exports = mongoose.model('project', projectSchema);
