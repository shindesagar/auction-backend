const express = require("express");
const {
    UserRegistraion,
    loginForm,
    userUpdate,
    getUserList
} =require('../controllers/user.controllers');
const jwtHandler =require('../utils/jwthandler')
// creating cusotm route;
const UserRoute =express.Router();

UserRoute.post('/register',UserRegistraion);
UserRoute.post('/login',loginForm)
UserRoute.put('/user/:id',jwtHandler ,userUpdate)
UserRoute.get('/user/list',getUserList)
module.exports =UserRoute;