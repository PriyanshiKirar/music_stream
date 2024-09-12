const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,  // In seconds
        required: true
    },
    album: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        default: 'defaultPoster.jpg'
    }
}, { timestamps: true });

const Track = mongoose.model('track', TrackSchema);
module.exports = Track;