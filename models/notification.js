const mongoose = require('mongoose');

function unsignedInteger (number) {
  return Math.round(number);
}

var notificationSchema = new mongoose.Schema({

  title: { type: String, required: '{PATH} is required!' },

  body: { type: String },

  date: Date,

  // set true if you want to send notifications for sepecific users
  // else the notification will be sent to every user( students ) in the
  // choosen academicYear
  isCustom: { type: Boolean, default: false},

  academicYear: { type: Number, min: 1, max: 5, validate: unsignedInteger },

  // references the sender ._id from users collection
  // only admin users can send notifications
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},

  // references the receivers ._id from users collection
  sendTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model('notification', notificationSchema);
