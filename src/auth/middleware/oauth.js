'use strict';

const superagent = require('superagent');
const users = require('../models/users-model');

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3000/oauth';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = proecess.env.CLIENT_SECRET;

module.exports = async function authorize(req, res, next){
    try {
        let code = req.query.code;
        console.log('code', code);
        let remoteToken = await exchangeCodeForToken(code);
        console.log('token', remoteToken);
        let remoteUser = await getRemoteUserInfo(remoteToken);
        console.log('github user', remoteUser);
        let [user, token] = await getUser(remoteUser);
        req.user = user;
        req.token = token;
        console.log('localuser', user);

        NodeList()
    } catch(e) { next(`error: ${e.message}`)}
};

async function exchangeCodeForToken(code){
    let tokenResponse = await (await superagent.post(tokenServerUrl)).send({
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: API_SERVER,
        grant_type: 'authorization_code',
    });

    let access_token = tokenResponse.body.access_token;

    return access_token;
}

async function getRemoteUserInfo(token) {
    let userResponse = await superagent.get(remoteAPI)
        .set('user-agent', 'express-app')
        .set('Authorization', `token ${token}`);

    let user = userResponse.body;
    return user;
}

async function getUser(remoteUser){
    let userRecord = {
        username:remoteUser.login,
        password: 'oauthpassword',
    }
    let user = await new users.save(userRecord);
    let token = user.generateToken(user);

    return [user, token];
    
}
