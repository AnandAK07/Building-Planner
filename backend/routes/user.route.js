const express = require('express');
const user = express.Router();
const { signup, login } = require('../controllers/userController');


user.post('/signup', signup);
user.post('/login', login);

module.exports = user;