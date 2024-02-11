const dbClient = require('../db/dbconnection');

exports.getRegistrationPage = (req, res) => {
    res.render('registration');
};

exports.handleRegistration = async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = dbClient.db(dbName);
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            res.status(409).send('Username already exists');
            return;
        }

        const newUser = { username, password };
        await collection.insertOne(newUser);

        res.redirect('/login');
    } catch (error) {
        console.error('Error handling registration:', error);
        res.status(500).send('Internal Server Error');
    }
};
