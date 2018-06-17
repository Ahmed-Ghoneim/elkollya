const mongoose = require('mongoose');

var departmentSchema = new mongoose.Schema({

  name: { type: String, required: '{PATH} is required!', unique: true },

  // references the the head of department ._id from users collection.
  head: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!', unique: true, ref: 'user' },

  // references the subjects ._id s from subjects collection.
  subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'subject'}],

  // references the professors ._id s from users collection.
  professors: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],

});

departmentSchema.pre('save', function(next){

  const User = require('../models/user');
  // Check for the head if he is an Admin or not.
  User.findById(this.head, 'isAdmin', function(err, user){
    if(err) return next(err);
    if(!user) return next(new Error('This head is not found'));
    else if(!user.isAdmin) return next(new Error('The head must be an Admin'));
  });
  // check for professors as they all must be admins.
  if(this.professors.length > 0){
    User.find({_id: {$in: this.professors}}, 'isAdmin', function(err, users){
      if(err) return next(err);
      if(!users) return next(new Error('Professors not found'));
      for (var user in users)
        if (!user.isAdmin) return next(new Error('All professors must be admins'));
    });
  }

  next();
});

module.exports = mongoose.model('department', departmentSchema);
