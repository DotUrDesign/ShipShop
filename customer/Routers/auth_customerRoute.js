const express = require('express');
const { register, logout, login, register_oauth_google, register_oauth_github } = require('../controllers/authController');
const app = express();
const customerRoute = express.Router();

customerRoute
.route('/register')
.post(register);

customerRoute
.route('/register_oauth_google')
.post(register_oauth_google);

customerRoute
.route('/register_oauth_github')
.post(register_oauth_github);

customerRoute
.route('/login')
.post(login);

customerRoute
.route('/logout')
.post(logout);

module.exports = customerRoute;