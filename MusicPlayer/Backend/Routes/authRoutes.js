

const mongoose = require('mongoose');

const authRouter = require('express').Router();

const { signup, signin } = require('../Controller/controller');

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);

module.exports = authRouter