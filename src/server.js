'use strict';

const express = require('express');
const cors = require('cors');
const router = require('./auth/router');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);

module.exports = {
    server: app,
    start: (port) => {
        app.listen(port, () => {
            console.log()
        })
    }
}