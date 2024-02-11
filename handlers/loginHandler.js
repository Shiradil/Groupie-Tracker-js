const dbClient = require('../db/dbconnection');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = dbClient.db('weatherwebsite');
        const collection = db.collection('users');
        const user = await collection.findOne({ username, password });

        if (user) {
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error handling login:', error);
        res.status(500).send('Internal Server Error');
    }
};
