const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs'
    }], 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const playlistModel = mongoose.model('playlists', playlistSchema);

module.exports = playlistModel;
