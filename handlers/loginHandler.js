const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    res.render('login', { registered: req.query.registered }); 
};

exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            req.session.user = { _id: user._id, username: username, isAdmin: user.isAdmin };
            if (user.isAdmin) {
                res.redirect('/admin')
            } else {
                res.redirect('/weather');
            }
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error handling login:', error);
        res.status(500).send('Internal Server Error');
    }
};
