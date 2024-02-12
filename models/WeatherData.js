const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    temperature: String,
    description: String,
    icon: String,
    coordinates: {
        latitude: String,
        longitude: String
    },
    feelsLike: String,
    humidity: String,
    pressure: String,
    windSpeed: String,
    countryCode: String,
    rainVolumeLast3Hours: String,
    exchange: String
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

module.exports = WeatherData;
