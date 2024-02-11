const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://shirbaev04:bauka@cluster0.xttjkma.mongodb.net/";
const dbName = "weatherwebsite";

const client = new MongoClient(uri);

client.connect(err => {
    if (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        return;
    }
    console.log("Connected to MongoDB Atlas");
});

module.exports = client;
