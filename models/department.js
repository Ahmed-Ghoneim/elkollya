const mongoose = require('mongoose');

var departmentSchema = new mongoose.Schema({

  name: { type: String, required: '{PATH} is required!', unique: true },

  // references the the head of department ._id from users collection.
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: '{PATH} is required!', unique: true },

  // references the subjects ._id s from subjects collection.
  subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'subject'}],

  // references the professors ._id s from users collection.
  professors: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],

  // references the students ._id s from users collection.
  students: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]

});

module.exports = mongoose.model('department', departmentSchema);
