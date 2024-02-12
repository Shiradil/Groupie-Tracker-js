const mongoose = require('mongoose');

const uri = "mongodb+srv://shirbaev04:bauka@cluster0.xttjkma.mongodb.net/weatherwebsite";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

module.exports = mongoose.connection;
