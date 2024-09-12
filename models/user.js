const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'track'
  }],
  profileImage: {
    type: String,
    default: 'defaultProfile.jpg',
  },
  isArtist: {
    type: Boolean,
    default: false
  }
},{ timestamps: true });

const User = mongoose.model('user', userSchema);
module.exports = User;
