const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joke: String
});

const JokeData = mongoose.model('JokeData', jokeSchema);

module.exports = JokeData;
