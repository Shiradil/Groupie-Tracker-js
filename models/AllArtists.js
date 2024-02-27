const mongoose = require('mongoose');

const allArtistsSchema = new mongoose.Schema({
    id: Number,
    images: [String], 
    name: String
});

const AllArtists = mongoose.model('Artist', allArtistsSchema);

module.exports = AllArtists;
