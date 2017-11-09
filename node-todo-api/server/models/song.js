let mongoose = require('mongoose');

let Song = mongoose.model('Song', {
    title: {
        type: String,
        required: true,
        minLength: 1
    },
    lyrics: {
        type: String,
        required: true,
        minLength: 1
    }
});

module.exports = {
    Song: Song
}