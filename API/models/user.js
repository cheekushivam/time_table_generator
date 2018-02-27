const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  firstname: {
    type: String,
    required: true

  },
  lastname: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      isAsync: false
    },
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    lowercase: true
  },
  date: {
    type: Date,
    default: function() {
      return new Date()
    }
  }
});



module.exports = mongoose.model('users', userSchema);
