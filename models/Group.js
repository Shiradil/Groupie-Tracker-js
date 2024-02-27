const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    names: {
        en: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        }
    },
    descriptions: {
        en: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        }
    },
    images: [{
        type: String,
        required: true
    }],
    firstAlbum: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updationDate: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
