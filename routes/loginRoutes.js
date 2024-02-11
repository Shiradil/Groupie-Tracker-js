const express = require('express');
const router = express.Router();
const loginHandler = require('../handlers/loginHandler');

router.get('/login', loginHandler.getLoginPage);
router.post('/login', loginHandler.handleLogin);

module.exports = router;
