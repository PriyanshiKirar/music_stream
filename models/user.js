const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [ {
        type: Schema.Types.ObjectId,
        ref: 'tracks'
    } ],
    playlists: [ {
        type: Schema.Types.ObjectId,
        ref: 'playlist'
    } ],
    profileImage: {
        type: String,
        default: 'defaultProfile.jpg'
    },
    isArtist: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('user', UserSchema);
module.exports = User;