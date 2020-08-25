'use strict';

const base64 = require('base-64');

const users = require('../models/users-model');

module.exports = async (req, res, next) => {
    if (!req.headers.authentication) { 
        next('Invalid Login');
        return; 
    }

    let basic = req.headers.authentication.split(' ').pop();

    let [user, pass] = base64.decode(basic).split(':');

    console.log('user pass', user, pass);

    const validUser = await new users.statics.authenticateBasic(user, pass);
    
    
    if(validUser){
        const token = validUser.generateToken
        req.token = token;
        next();
    } else {
        next({ 'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage':'Unauthorized'});
    }
    

}
