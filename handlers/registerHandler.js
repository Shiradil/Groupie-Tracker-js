const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getRegistrationPage = (req, res) => {
    res.render('registration');
};

exports.handleRegistration = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.redirect('/login?registered=true');
    } catch (error) {
        console.error('Error handling registration:', error);
        res.status(500).send('Internal Server Error');
    }
};
