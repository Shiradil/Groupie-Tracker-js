const express = require('express');
const router = express.Router();
const registrationHandler = require('../handlers/registerHandler');

router.get('/register', registrationHandler.getRegistrationPage);
router.post('/register', registrationHandler.handleRegistration);

module.exports = router;
