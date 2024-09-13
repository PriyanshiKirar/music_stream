const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        default: 'defaultPoster.jpg'
    },
    tracks: [ {
        type: Schema.Types.ObjectId,
        ref: 'track'
    } ],
    isAlbum: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const Playlist = mongoose.model('playlist', PlaylistSchema);
module.exports = Playlist;