const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const User = require('./models/User');
const Group = require('./models/Group');

const crypto = require('crypto')

const dbConnection = require('./db/dbconnection');

const loginHandler = require('./handlers/loginHandler');
const registerHandler = require('./handlers/registerHandler');
const addUserHandler = require('./handlers/addUserHandler')

const apidata = require('./apidata')

const secretKey = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/groupie-tracker', async (req, res) => {
    try {
        const artists = await apidata.GetAllArtists();
        const groups = await Group.find({});
        console.log(groups._id)

        if (req.session.user) {
            res.render('groups', { artists, groups }); 
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/groupie-tracker/artists/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const artists = await apidata.GetArtistByID(id);
        const relation = await apidata.GetRelationByID(id);
        const locations = await apidata.GetLocationByID(id);

        if (req.session.user) {
            const data = { artists, relation, locations };
            res.render('artist', data);
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/groupie-tracker/groups/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const group = await Group.findById(id);

        if (req.session.user) {
            const data = { group };
            res.render('group', data); 
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/groupie-tracker/favorites', async (req, res) => {
    try {
        const userId = req.session.user._id; 

        const user = await User.findById(userId).populate('favoriteGroups').exec();

        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }

        res.render('favorites', { user });
    } catch (error) {
        console.error('Ошибка при загрузке избранных:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

app.get('/groupie-tracker/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

app.get('/groupie-tracker/users/:userId/favorites', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('favoriteGroups').exec();
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }
        res.render('favorites', { user });
    } catch (error) {
        console.error('Ошибка при загрузке избранных элементов пользователя:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});

app.post('/add-favorites/:groupId', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const groupId = req.params.groupId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).send('Артист не найден');
        }

        if (user.favoriteGroups.includes(groupId)) {
            return res.status(400).send('Артист уже добавлен в избранные');
        }

        user.favoriteGroups.push(groupId);
        await user.save();

        res.redirect('/groupie-tracker');
    } catch (error) {
        console.error('Ошибка при добавлении артиста в избранные:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

app.post('/add-to-favorites/:artistName', async (req, res) => {
    try {
        const userId = req.session.user._id; 
        const artistName = req.params.artistName; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }

        if (user.favoriteArtists.includes(artistName)) {
            return res.status(400).send('Артист уже добавлен в избранные');
        }

        user.favoriteArtists.push(artistName);
        await user.save();

        res.redirect('/groupie-tracker');
    } catch (error) {
        console.error('Ошибка при добавлении артиста в избранные:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});


app.get('/admin', async (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        try {
            const users = await User.find({});
            const group = await Group.find({});
            res.render('admin', { users, group });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    } else {
        res.redirect('/login');
    }
});

app.post('/admin/add', addUserHandler.handleAddUser);

app.post('/admin/update/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { username, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.username = username;
        user.password = password;
        await user.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});

app.post('/admin/delete/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        await User.deleteOne({ _id: userId });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

app.post('/admin/addGroup', async (req, res) => {
    try {
        const { names, descriptions, image1, image2, image3, firstAlbum } = req.body;

        const images = [image1, image2, image3];

        const newGroup = new Group({
            names: {
                en: names.en,
                ru: names.ru
            },
            descriptions: {
                en: descriptions.en,
                ru: descriptions.ru
            },
            images, 
            firstAlbum
        });

        await newGroup.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding new group');
    }
});

app.post('/admin/updateGroup/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { names, descriptions, image, firstAlbum } = req.body;
        await Group.findByIdAndUpdate(groupId, {
            names,
            descriptions,
            image,
            firstAlbum,
            updationDate: Date.now()
        });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating group');
    }
});

app.post('/admin/deleteGroup/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        await Group.findByIdAndDelete(groupId);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).send('Error deleting group');
    }
});

app.get('/login', loginHandler.getLoginPage);
app.post('/login', loginHandler.handleLogin);

app.get('/register', registerHandler.getRegistrationPage);
app.post('/register', registerHandler.handleRegistration);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
