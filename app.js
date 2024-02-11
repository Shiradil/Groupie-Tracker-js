const express = require('express');
const app = express();
const port = 3000;

const dbClient = require('./db/dbconnection');
const loginHandler = require('./handlers/loginHandler');
const registerHandler = require('./handlers/registerHandler');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', loginHandler.getLoginPage);
app.post('/login', loginHandler.handleLogin);

app.get('/register', registerHandler.getRegistrationPage);
app.post('/register', registerHandler.handleRegistration);

dbClient.connect(err => {
    if (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        return;
    }
    console.log("Connected to MongoDB Atlas");

    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
});
