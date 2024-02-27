const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    locations: {
        type: [String],
        required: true
    },
    dates: {
        type: String,
        required: true
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
