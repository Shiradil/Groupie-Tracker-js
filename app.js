const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('static'));


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    res.redirect('/dashboard');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
