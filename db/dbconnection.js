const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://shirbaev04:bauka@cluster0.xttjkma.mongodb.net/";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        return;
    }
    console.log("Connected to MongoDB Atlas");
    
    const db = client.db('weatherwebsite');
    
    const collection = db.collection('user');
    collection.insertOne({ key: value }, (err, result) => {
        if (err) {
            console.error("Error inserting document:", err);
            return;
        }
        console.log("Document inserted successfully");
    });
});
