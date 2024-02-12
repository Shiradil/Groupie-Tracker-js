const User = require('../models/User');

async function handleAddUser(req, res) {
    try {
        const { username, password } = req.body;
        await User.create({ username, password, creationDate: Date.now() });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
}

module.exports = { handleAddUser };
