'use strict';

const mongoose = require('mongoose');
const server = require('./src/server');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(MONGODB_URI, mongooseOptions);
server.start(PORT);
