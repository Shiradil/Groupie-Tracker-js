const mongoose = require('mongoose');

const dateLocationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    datesLocations: {
        type: Map,
        of: [String],
        required: true
    }
});

const DateLocation = mongoose.model('DateLocation', dateLocationSchema);

module.exports = DateLocation;
    