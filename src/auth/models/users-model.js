'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const username = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String},
    role: {type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user']},
});



username.pre('save', async function() {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

username.statics.authenticateBasic = function(username, password) {
    let query = { username: username};
    return this.find(query)
        .then(user => user && user.comparePassword(password))
        .catch(console.error);
    
};

username.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
        .then(valid => valid ? this : null);
}

username.methods.generateToken = function() {
    let tokenData = {
        id: this._id,
    };

    const signed = jwt.sign(tokenData, process.env.SECRET);

    return signed;
}

module.exports = mongoose.model('username', username);
