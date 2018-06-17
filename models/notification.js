const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({

  title: { type: String, required: '{PATH} is required!' },

  body: { type: String },

  date: Date,

  // references the sender ._id from users collection
  // only admin users can send notifications
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},

  // references the receivers ._id from users collection
  sentTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model('notification', notificationSchema);
