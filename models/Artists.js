const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    firstAlbum: {
        type: Date,
        required: true
    },
    locations: {
        type: String,
        required: true
    },
    concertDates: {
        type: String,
        required: true
    },
    relations: {
        type: String,
        required: true
    }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
