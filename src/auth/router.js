'use strict';

const express = require('express');
const router = express.Router();
const users = require('./models/users-model');
const auth = require('./middleware')

router.post('/signup', (req, res, next) => {
    const user = new users(req.body);

    user.save()
        .then(user => {
            let token = user.methods.generateToken(user);
        })
})

router.post('/signin', auth, (req, res, next) => {

    res.cookie('auth', req.token);
    res.send({
        token: req.token,
        user: req.user,
    });
})

router.get('/users', async (req, res, next) => {
    const allUsers = await users.find({});
    return allUsers;
})

module.exports = {}
