const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    baseCurrency: String,
    targetCurrency: String,
    rate: Number,
    createdAt: { type: Date, default: Date.now }
});

const ExchangeData = mongoose.model('ExchangeData', exchangeSchema);

module.exports = ExchangeData;
