const express = require('express');
const router = express.Router();

app.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;