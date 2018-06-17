const mongoose = require('mongoose')

var subjectSchema = new mongoose.Schema({

  name: { type: String, required: '{PATH} is required!', unique: true },

  code: {type: String, required: '{PATH} is required!', unique: true},

  objective: { type: String },

  academicYear: { type: Number, match: /^[1-5]$/ },

  semester: { type: Number, match: /^[1-2]$/ },

  minMark: { type: Number },

  maxMark: { type: Number },

  colorCode: { type: String, required: '{PATH} is required!', unique: true },

  // refrences the related professor ._id from users collection.
  taughtBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

})

module.exports = mongoose.model('subject', subjectSchema)
