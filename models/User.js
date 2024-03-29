const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    deletionDate: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    favoriteGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }], 
    favoriteArtists: [{
        type: String,
        ref: 'Artist'
    }],
    language: {
        type: String,
        default: "en"
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
